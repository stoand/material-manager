let express = require('express');
let app = express();
let mysql = require('mysql');
let bodyParser = require('body-parser');
require('dotenv').config();
let process = require('process');

let auth = require('./auth');
let admin = require('./admin');

app.use('/', express.static('dist'));

app.use(bodyParser.json());
app.use((req, res, next) => {
    req.db = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE_NAME,
    });

    res.on('finish', function () {
        req.db.destroy();
    });

    next();
});

app.post(auth.authorize);
app.post('/api/admin', auth.authorizeAdmin);

app.post('/api/login', auth.login);
app.post('/api/admin/user/create', admin.createUser);
app.post('/api/admin/user/update', admin.updateUser);
app.post('/api/admin/user/list', admin.listUsers);
app.post('/api/admin/user/delete', admin.deleteUser);
app.post('/api/admin/user/reset-password', admin.resetPassword);


app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});