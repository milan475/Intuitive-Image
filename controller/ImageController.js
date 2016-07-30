var https = require('https');
var http = require('http');
var fs = require('fs');
var lib = require(root + '/lib/lib.js');
var gm = require('gm');

function ImageController() {

    function download(url, dest, cb) {
        var file = fs.createWriteStream(dest);

        var reqHandler = (url.indexOf('https://') === 0) ? https : http;

        var request = reqHandler.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(cb);  // close() is async, call cb after close completes.
            });
        }).on('error', function (err) { // Handle errors
            console.log('errors');
            fs.unlink(dest); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    };

    function urlAllowed(url) {
        var domain;
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }
        domain = domain.split(':')[0];

        return !(config.allowedDomains.indexOf(domain) === -1);

    }

    return {
        resize: (req, res) => {

            var url = req.query.url;
            var width = req.query.width;
            var height = req.query.height;
            var crop = req.query.crop;

            if (!urlAllowed(url)){
                res.send('domain not allowed');
                return;
            }

            var fileHash = lib.sha1(url);
            var ext = url.split('.')[url.split('.').length - 1];

            var savePath = root + '/cache/originals/' + fileHash + '.' + ext;

            var resizeAndReturnImage = function (savePath) {

                if (crop) {

                    var resizedImageSavePath = root + '/cache/resized/' + fileHash + '-' + width + 'x' + height + '-crop.' + ext;

                    if (fs.existsSync(resizedImageSavePath)) {
                        res.sendFile(resizedImageSavePath);
                        return;
                    }

                    gm(savePath)
                        .resize(width, height, '^')
                        .gravity('Center')
                        .crop(width, height)
                        .write(resizedImageSavePath, function (err) {
                            if (err) { res.json(err); return };
                            res.sendFile(resizedImageSavePath);
                        });

                } else {

                    var resizedImageSavePath = root + '/cache/resized/' + fileHash + '-' + width + 'x' + height + '.' + ext;

                    if (fs.existsSync(resizedImageSavePath)) {
                        res.sendFile(resizedImageSavePath);
                        return;
                    }

                    gm(savePath)
                        .resize(width, height)
                        .write(resizedImageSavePath, function (err) {
                            if (err) { res.json(err); return };
                            res.sendFile(resizedImageSavePath);
                        });
                }
            }

            if (fs.existsSync(savePath)) {
                resizeAndReturnImage(savePath);
            } else {
                download(url, savePath, (err) => {
                    if (err) { res.json(err); return };
                    resizeAndReturnImage(savePath);
                });
            }

        }
    }
}

module.exports = ImageController();