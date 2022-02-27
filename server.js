let express = require('express');
// let bodyParser = require('body-parser');
const AppConfig = require('./config/app-config');
let handler = require('./model/user');
const cors = require('cors');
const cron = require('node-cron');
let http = require('http');
//create an application using express
const routes = require('./routes');
const app = express();
// app.use(cors());
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
class Server {
    constructor() {
        this.app = express();
        // this.http = http.Server(this.app);
    }

 
    /* Including app Routes starts */
    includeRoutes() {
            new routes(this.app).routesConfig();
        }
        /* Including app Routes ends */
    appConfig() {
        new AppConfig(this.app).includeConfig();
    }
    startTheServer() {
        this.appConfig();
        this.includeRoutes();

        const port = 3000;
        console.log(port);
        this.app.listen(port, () => {
            console.log('Server running at port : ' + port);
            // console.log(`Listening on http://${host}:${port}`);
        });
    }
   
}
// cron.schedule('*/1 * * * * *', () => {
//     handler.gameDeactivation();
//     // console.log('running a task every two minutes');
//   });

module.exports = new Server();