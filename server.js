// global vars //

config = require('./config.js');
nodeRequire = require;
root = __dirname;

// Include dependencies //

var express = require('express');
var path = require('path');
var routes = require('./routes.js');
var lib = require('./lib/lib.js');
var bodyParser = require('body-parser');

app = express();
app.isDev = (config.hasOwnProperty('environment') && config.environment == 'dev') ? true : false;
app.use(bodyParser.urlencoded({extended: true}));

// Initialize Template Engine //

app.do404 = function (res) {
	res.status(404);
	res.jsonp({
		success: false,
		msg: '404'
	})
};

app.do401 = function (res) {
	res.status(401);
	res.jsonp({
		success: false,
		msg: '401'
	})
}

// HTTP Routing //

var controllers = Array();

for (route in routes) {

	var routeAction = function (route) {
		return function (req, res) {
			app.set('views', path.join(__dirname, 'views'));
			var controllerName = route.controller;
			var controllerAction = route.action;
			if (undefined == controllers[controllerName]) {
				controllers[controllerName] = require('./controller/' + lib.textTransformations.ucfirst(controllerName) + 'Controller.js');
			}
			res.header("Access-Control-Allow-Origin", "*");
			controllers[controllerName][controllerAction](req, res);
		}
	};

	if (routes[route].all) {
		app.all(String(route), routeAction(routes[route].all));
	} else {
		if (routes[route].get) {
			app.get(String(route), routeAction(routes[route].get));
		}
		if (routes[route].post) {
			app.post(String(route), routeAction(routes[route].post));
		}
	}
}

var port = (process.env.PORT || 3004);
console.log('Server listening on port ' + port);
app.listen(port);

