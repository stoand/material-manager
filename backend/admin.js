exports.createUser = function (req, res) {
    let user = req.body;
    let query = `INSERT INTO users(phone, email, password, type, joined, lastactive, name_en, name_ar)
        VALUES (?,?,?,?,?,?,?,?);`;

    req.db.query(query, [user.phone, user.email, user.password, user.type, new Date(),
    new Date(), user.name_ar, user.name_en], function (err, rows) {
        if (err) {
            res.status(400);
            res.send({ error: 'invalid_format' })
        } else {
            res.send({ user: rows[0] });
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
};