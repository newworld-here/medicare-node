const mysql = require('mysql2');


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'medicare',
    // connectionLimit: 10,
    // multipleStatements: true

});
connection.connect(function (error) {
    if (!!error) {
        console.log('Database Connection Error');
    } else {
        console.log('Database Connected');
    }
});


module.exports = connection;