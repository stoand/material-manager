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

            req.db.query(query, [user.phone, user.email, user.password || 1234, user.type, new Date(),
            new Date(), user.name_en, user.name_ar], function (err, rows) {
                if (err) {
                    console.log(err);
                    res.status(400);
                    res.send({ error: 'invalid_format' })
                } else {
                    res.send({ user: rows[0] });
                }
            });
        }
    });
}

exports.listUsers = function (req, res) {
    req.db.query('SELECT id, phone, email, type, joined, lastactive, name_en, name_ar FROM users ORDER BY LOWER(name_en)', (err, rows) => {
        if (err) {
            res.status(500);
            res.send({ error: 'unknown' })
        } else {
            res.send({ users: rows });
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