module.exports = function ({app, UserManager}) {
    app.post("/api/createAccount", async function(req, res) {
        const username = req.body.user;
        const password = req.body.password;

        if (!(await UserManager.exists(username))) {
            res.send([false, "uat"]);
            return;
        }

        if (username.length < 3 || username.length > 16) {
            res.send([false, "username_length"]);
            return;
        }

        if (password.length < 8 || password.length > 32) {
            res.send([false, "password_length"]);
        }

        for (const char of username.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                res.send([false, "username_bad_text"]);
            }
        }

        for (const char of password.toLowerCase()) {
            if (!LETTERS.includes(char) && !NUMBERS.includes(char) && char !== "_") {
                res.send([false, "password_bad_text"]);
                return;
            }
        }

        res.send([true, await UserManager.createAccount(username, password)]);
    });
}
