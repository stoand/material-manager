let https = require('https');
let process = require('process');
let crypto = require('crypto');

function userWithEmailExists(db, id, email, callback) {
    if (!email) {
        callback(undefined, false);
    } else {
        db.query('SELECT 1 FROM users WHERE id != ? AND email = ?', [id, email], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(undefined, rows[0])
            }
        });
    }
}

exports.resetPassword = function (req, res) {
    let user = req.body.user;
    sendNewPassword(req.db, user, (err) => {
        if (err) {
            res.status(500);
            res.send({ error: 'unknown' })
        } else {
            res.send({ success: true });
        }
    });
}

function sendNewPassword(db, user, callback) {
    crypto.randomBytes(8, (err, bytes) => {
        let email = user.email;
        let password = bytes.toString('hex');

        let postData = JSON.stringify({
            "personalizations": [
                {
                    "to": [
                        {
                            email
                        }
                    ],
                    "subject": "BE Material Manager Credentials"
                }
            ],
            "from": {
                "email": "gm@be.jo"
            },
            "content": [
                {
                    "type": "text/html",
                    "value": `Hello,<br><br>
                    below are your new credentials for logging in to <a target="_blank" href='www.be.jo/materialmanager'>be.jo/materialmanager</a>:
                    <br><br><b>Email:</b> ${email}<br> <b>Password:</b> ${password}<br>`
                }
            ]
        });

        let options = {
            host: 'api.sendgrid.com',
            port: '443',
            path: '/v3/mail/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + process.env.SENDGRID_KEY,
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let req = https.request(options, (res) => {
            if (res.statusCode === 202) {
                db.query('UPDATE users SET password = ? WHERE email = ? LIMIT 1', [password, email], (err, res) => {
                    callback(err, res);
                });
            } else {
                callback(true);
            }
        });
        req.write(postData);
        req.end();
    });
}

exports.createUser = function (req, res) {
    let user = req.body.user;
    userWithEmailExists(req.db, -1, user.email, (err, duplicateExists) => {
        if (duplicateExists) {
            if (err) {
                res.status(500);
                res.send({ error: 'unknown' })
            } else {
                res.status(400);
                res.send({ error: 'email_not_unique' });
            }
        } else {
            let query = `INSERT INTO users(phone, email, password, type, joined, lastactive, name_en, name_ar)
                VALUES (?,?,?,?,?,?,?,?);`;

            req.db.query(query, [user.phone, user.email, '', user.type, new Date(),
            new Date(), user.name_en, user.name_ar], function (err, rows) {
                if (err) {
                    res.status(400);
                    res.send({ error: 'invalid_format' })
                } else {
                    sendNewPassword(req.db, user, (err) => {
                        res.send({ user: rows[0] });
                    });
                }
            });
        }
    });
}

exports.listUsers = function (req, res) {
    req.db.query(`SELECT users.id, phone, email, type, joined, lastactive, name_en, name_ar, COUNT(DISTINCT transactions.id) as transactions FROM users 
            LEFT JOIN transactions ON transactions.customer = users.id OR transactions.driver = users.id
             GROUP BY users.id ORDER BY LOWER(name_en)`, (err, rows) => {
            if (err) {
                console.log(err);
                res.status(500);
                res.send({ error: 'unknown' })
            } else {
                res.send({ users: rows });
            }
        });
}

exports.deleteUser = function (req, res) {
    let user = req.body.user;
    req.db.query('DELETE FROM users WHERE id = ?', [user.id], (err, rows) => {
        if (err) {
            res.status(500);
            res.send({ error: 'unknown' })
        } else {
            res.send({ success: true });
        }
    });
}

exports.updateUser = function (req, res) {
    let user = req.body.user;

    userWithEmailExists(req.db, user.id, user.email, (err, duplicateExists) => {
        if (duplicateExists) {
            if (err) {
                res.status(500);
                res.send({ error: 'unknown' })
            } else {
                res.status(400);
                res.send({ error: 'email_not_unique' });
            }
        } else {
            let query = `UPDATE users SET phone = ?, email = ?, password = IFNULL(?, users.password), type = ?, name_en = ?, name_ar = ?
        WHERE users.id = ?`;

            req.db.query(query, [user.phone, user.email, user.password, user.type, user.name_en, user.name_ar, user.id],
                function (err, rows) {
                    if (err) {
                        res.status(400);
                        res.send({ error: 'invalid_format' })
                    } else {
                        res.send({ success: true });
                    }
                });
        }
    });
};