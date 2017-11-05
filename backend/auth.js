let crypto = require('crypto');

let loginDuration = 20;

let userTypes = {
    admin: 1,
}

function getUser(db, token, callback) {
    db.query(`SELECT * from users JOIN tokens WHERE users.id = tokens.user AND tokens.expires > NOW()
    AND tokens.action = 0 and tokens.value = ? LIMIT 1`,
        [token], callback);
}

exports.authorize = (req, res, next) => {
    let token = req.headers['auth-token'];

    getUser(req.db, token, (err, rows) => {
        req.user = rows && rows[0];
        next();
    });

    let expires = new Date(new Date().setMinutes(new Date().getMinutes() + loginDuration));
    req.db.query('UPDATE tokens SET expires = ? WHERE tokens.value = ?', [expires, token]);
};

exports.login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(401);
        res.json({ error: 'unauthorized' });
    } else {
        crypto.randomBytes(8, (err, bytes) => {
            let expires = new Date(new Date().setMinutes(new Date().getMinutes() + loginDuration));
            let token = bytes.toString('hex');
            req.db.query(`INSERT INTO tokens (\`user\`, \`value\`, \`expires\`, \`action\`)
            SELECT users.id, ?, ?, ? FROM users WHERE users.email = ? AND users.password = ? LIMIT 1`,
                [token, expires, 0, req.body.email, req.body.password], (err, rows) => {
                    if (rows && rows.affectedRows) {
                        getUser(req.db, token, (err, rows) => {
                            let user = rows[0];
                            delete user.password;
                            res.json({ token, user });
                        });
                    } else {
                        res.status(401);
                        res.json({ error: 'unauthorized' });
                    }
                });
        });
    }
};

exports.authorizeAdmin = function (req, res, next) {
    if (req.user && req.user.type === userTypes.admin) {
        next();
    } else {
        res.status(401);
        res.send({ error: 'unauthorized' });
    }
};