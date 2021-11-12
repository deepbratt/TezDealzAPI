// Importing log files
var log4js = require("log4js");
log4js.configure({
	"appenders": {
		"app": { "type": "file", "filename": "../../app.log" }
	},
	"categories": {
		"default": {
			"appenders": ["app"],
			"level": "all"
		}
	}
});
var logger = log4js.getLogger("Ads");




try {
    const Car = require('../../models/cars/carModel');

    const { citiesByProvince } = require('../factory/factoryHandler');

    exports.getCitiesByProvince = citiesByProvince(Car);
}
catch (e) {
    logger.error("Custom Error Message")
    logger.trace("Something unexpected has occured.", e)
}
