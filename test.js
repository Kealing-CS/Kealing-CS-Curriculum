var fs = require('fs')
const colors = require("colors")

if (process.argv.indexOf("--reset") === -1 && process.argv.indexOf("-R") === -1) {
    console.log("Resetting database...")
    fs.writeFileSync('./db/sensitivedata.db', '')
    fs.writeFileSync('./db/userdata.db', '')
    fs.writeFileSync('./db/admins.json', '[]')
    console.log("Done!")
}

require("./server/server")

/*
Current tests:
- normal create account
- short username in create account
- short password in create account
- long username in create account
- long password in create account
- not allowed chars in username create account
- not allowed chars in password create account
- login
- fresh login
- submit for wrong code
- submit for right code
*/

async function test() {
    let failed = false;

    try {
        let createNormal = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test",
                password: "testword"
            })
        })
        .then(res => res.json())
        if (createNormal[0] !== true) {
            console.log(createNormal)
            console.log("[", "BAD".red, "]", "Failed to create normal account")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Succeeded in creating a normal account")
        }

        let createShortU = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "te",
                password: "testword"
            })
        })
        .then(res => res.json())
        if (createShortU[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short username")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed in creating an account with a short username")
        }

        let createShortP = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "testSP",
                password: "test"
            })
        })
        .then(res => res.json())
        if (createShortP[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short password")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed in creating an account with a short password")
        }

        let createLongU = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "qwertyuiopasdfghj",
                password: "testword"
            })
        })
        .then(res => res.json())
        if (createLongU[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long username")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed in creating an account with a long username")
        }

        let createLongP = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test",
                password: "qwertyuiopasdfghjklzxcvbnmqwerty"
            })
        })
        .then(res => res.json())
        if (createLongP[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long password")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed in creating an account with a long password")
        }

        let createNACU = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test*",
                password: "testword"
            })
        })
        .then(res => res.json())
        if (createNACU[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded to create account with bad username")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed to create account with bad username")
        }

        let createNACP = await fetch("http://localhost:8008/api/createAccount", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "testNACP",
                password: "testword*"
            })
        })
        .then(res => res.json())
        if (createNACP[0] === true) {
            console.log("[", "BAD".red, "]", "Succeeded to create account with bad password")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Failed to create account with bad password")
        }

        let login = await fetch("http://localhost:8008/api/login", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test",
                token: createNormal[2]
            })
        })
        .then(res => res.status)

        if (login != 200) {
            console.log("[", "BAD".red, "]", "Failed to login")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Logged in")
        }

        let freshLogin = await fetch("http://localhost:8008/api/freshLogin", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test",
                password: "testword"
            })
        })
        .then(res => res.json())

        if (freshLogin[0] !== true) {
            console.log("[", "BAD".red, "]", "Failed to freshLogin")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "fresh logged in")
        }

        let submitWrong = await fetch("http://localhost:8008/api/submit", {
            method: "POST",
            body: JSON.stringify({
                user: "test",
                token: freshLogin[2],
                level: "start",
                code: {
                    html: "htmlcode",
                    js: "jscode",
                    css: "csscode"
                }
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
        .then(res => res.json())

        if (submitWrong) {
            console.log("[", "BAD".red, "]", "Wrong output for wrong code")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Right output for wrong code")
        }

        let submitRight = await fetch("http://localhost:8008/api/submit", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                user: "test",
                token: freshLogin[2],
                level: "start",
                code: {
                    html: "<div id='test'></div>",
                    js: "console.log('Hello, world!')",
                    css: "#test {background-color: red;}"
                }
            })
        })
        .then(res => res.json())

        if (!submitRight) {
            console.log("[", "BAD".red, "]", "Wrong output for right code")
            failed = true;
        } else {
            console.log("[", "OK".green, "]", "Right output for right code")
        }

        if (!failed) {
            console.log("[", "OK".green, "]", "All tests passed!")
            process.exit(0)
        } else {
            console.log("[", "BAD".red, "]", "Some tests failed")
            process.exit(1)
        }
    } catch(e) {
        console.log("[", "BAD".red, "]", "Error in test script")
        // log the error but not the trace, unless -d or --debug is passed
        if (process.argv.indexOf("-d") !== -1 || process.argv.indexOf("--debug") !== -1) {
            console.log(e)
        } else {
            console.log(e.message)
        }
        process.exit(1)
    }
}

test()