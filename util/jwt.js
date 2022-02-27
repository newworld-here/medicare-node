const expressJwt = require('express-jwt');
const publicRoutes = require('./jwt-route');

class JWT {
    constructor(app) {
        this.app = app;
    }

    setJWTConfig() {
        this.app.use(
            expressJwt({
                // secret: process.env.JWT_SECRET,
                // algorithms: ['RS256']
                secret: 'wegyvf7wevf7yg7ygcr7y3gbr7y3gr7y34r7g4r7yg',
                algorithms: ['RS256']
            }).unless({
                path: publicRoutes,
            }),
        );
    }
}
//var token = req.body.access_token || req.query.access_token || req.headers['x-access-token'] || req.cookies.access_token;

module.exports = JWT;