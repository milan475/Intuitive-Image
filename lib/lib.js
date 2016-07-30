if (typeof window == 'undefined') {
	var crypto = nodeRequire('crypto');
	var _ = nodeRequire('underscore');
}

var lib = {
	textTransformations: {
		ucfirst: function (str) {
			str += '';
			var f = str.charAt(0).toUpperCase();
			return f + str.substr(1);
		},
		camelCase: function (str) {
			return str.replace(/-([a-z])/g, function (g) {
				return g[1].toUpperCase();
			});
		}
	},
	getCurrentUri: function (req) {
		return req.protocol + '://' + req.get('host') + req.originalUrl;
	},
	sha1: function (string) {
		return crypto.createHash('sha1').update(string).digest('hex');
	},
	md5: function (string) {
		return crypto.createHash('md5').update(string).digest('hex');
	},
	removeEmpty: function (json) {
		for (var i in json) {
			if (json[i] === '') {
				delete json[i];
			}
		}
		return json;
	},


	slugify: function (text) {
		return text.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of text
			.replace(/-+$/, '');            // Trim - from end of text
	},

	merge: function (obj1, obj2) {
		var obj3 = {};
		for (var attrname in obj1) {
			obj3[attrname] = obj1[attrname];
		}
		for (var attrname in obj2) {
			obj3[attrname] = obj2[attrname];
		}
		return obj3;
	},
	filterWPContent: function (orig_content) {
		var content = _.clone(orig_content);
		var images = content.match(/<img([\w\W]+?)>/g);
		_.each(images, function (image) {

			var newImageTag = image.replace('width', 'data-width');
			var newImageTag = newImageTag.replace('height', 'data-height');
			var newImageTag = newImageTag.replace('src', 'data-src');
			var newImageTag = newImageTag.replace('data-data-src', 'data-src');

			content = content.replace(image, newImageTag);

		})
		return content;
	},
	uid: function () {

		var chars = '0123456789abcdef'.split('');

		var uuid = [], rnd = Math.random, r;
		uuid[8] = uuid[13] = uuid[18] = uuid[23] = '';
		uuid[14] = '4';

		for (var i = 0; i < 30; i++) {
			if (!uuid[i]) {
				r = 0 | rnd() * 16;

				uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
			}
		}

		return uuid.join('');
	},
	validateEmail: function (email) {
		var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
}

if (typeof module != 'undefined') {
	module.exports = lib;
}
