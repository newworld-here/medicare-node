const user = require('./model/user');
const jwt = require('jsonwebtoken');

class Routes {
    constructor(app) {
        app.use(function(err, req, res, next) {
            console.log(err.name);
            if (err.name === 'UnauthorizedError') {
                return res.status(403).send({
                    success: false,
                    message: 'No token provided given by.'
                });
            }
        });
        this.app = app;
    }
    appRoutes() {

        function validateToken(req, res, next) {
            const authorizationHeaader = req.headers.authorization;
            let result;
            if (authorizationHeaader) {
                const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
                // console.log(token);
                const options = {
                    expiresIn: '2d',
                    //   issuer: 'https://scotch.io'
                };
                try {
                    // verify makes sure that the token hasn't expired and has been issued by us
                    result = jwt.verify(token, 'secret', options);

                    // Let's pass back the decoded token to the request object
                    req.decoded = result;
                    // We call next to pass execution to the subsequent middleware
                    next();
                } catch (err) {
                    // Throw an error just in case anything goes wrong with verification
                    // throw new Error(err);
                    return res.status(200).json({
                        'messsage': 'token missing or expire'
                    });
                }
            } else {
                result = {
                    error: `Authentication error. Token required.`,
                    status: 401
                };
                res.status(401).send(result);
            }
        }

        this.app.post('/login', user.login);
        this.app.post('/adduserDetails', user.addUser);
        this.app.post('/getAllUserDetails', user.getUsers);
        this.app.post('/createmed', user.createmed);
        this.app.post('/getActiveMedList', user.getActiveMedList);
        this.app.post('/getMedList', user.getMedList);
        this.app.post('/activationMed', user.activationMed);
        this.app.post('/pay',user.pay);
        this.app.post('/pdf', user.pdf);
        this.app.post('/upload', user.file);
        this.app.post('/mail', user.contact_mail);

    }

    routesConfig() {
        this.appRoutes();
    }

};

module.exports = Routes;