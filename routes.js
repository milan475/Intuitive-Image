var routes = {
	"/": {
		"all": {
			"controller": "home",
			"action": "default"
		}
	},
	"/resize":{
		"get": {
			"controller": "image",
			"action": "resize"
		}
	}
}

module.exports = routes;
