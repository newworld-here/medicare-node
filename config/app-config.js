/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
const bodyParser = require('body-parser');
const JWT = require('../util/jwt');
const cors = require('cors');
const fileUpload = require('express-fileupload');

class AppConfig {
    constructor(app) {
        // process.on('unhandledRejection', (reason, p) => {
        //     console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
        //     // application specific logging, throwing an error, or other logic here
        // });
        this.app = app;
    }

    includeConfig() {
        this.loadAppLevelConfig();
        this.loadExpressConfig();
    }
 


    loadAppLevelConfig() {
        //enabling cors
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
            next();
        });
        //specify the bodyParser input types i.e urlecondoed Post data or Json Data
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(
            bodyParser.json(),
        );
        this.app.use(fileUpload({ createParentPath: true}))
        // this.app.use(
        //   cors(),
        // );
    }

    loadExpressConfig() {
        new JWT(this.app).setJWTConfig();
    }
}
module.exports = AppConfig;