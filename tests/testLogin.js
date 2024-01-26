const colors = require("colors")

module.exports = async function (failed, debug) {
    // test normal create account
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
        if (debug) {
            console.log(createNormal)
        }
        console.log("[", "BAD".red, "]", "Failed to create normal account")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Succeeded in creating a normal account")
    }

    // test doing a too short username

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
    if (createShortU[0]) {
        if (debug) {
            console.log(createShortU)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short username")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed in creating an account with a short username")
    }

    // test doing a too short password

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
    if (createShortP[0]) {
        if (debug) {
            console.log(createShortP)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short password")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed in creating an account with a short password")
    }

    // test doing a too long username

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
    if (createLongU[0]) {
        if (debug) {
            console.log(createLongU)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long username")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed in creating an account with a long username")
    }

    // test doing a too long password

    let createLongP = await fetch("http://localhost:8008/api/createAccount", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "testLP",
            password: "qwertyuiopasdfghjklzxcvbnmqwerty"
        })
    })
    .then(res => res.json())
    if (createLongP[0]) {
        if (debug) {
            console.log(createLongP)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long password")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed in creating an account with a long password")
    }

    // test not allowed chars in username

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
    if (createNACU[0]) {
        if (debug) {
            console.log(createNACU)
        }
        console.log("[", "BAD".red, "]", "Succeeded to create account with bad username")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed to create account with bad username")
    }

    // test doing a not allowed char in password

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
    if (createNACP[0]) {
        if (debug) {
            console.log(createNACP)
        }
        console.log("[", "BAD".red, "]", "Succeeded to create account with bad password")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Failed to create account with bad password")
    }

    // test doing a normal token login

    let login = await fetch("http://localhost:8008/api/login", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            token: createNormal[1]
        })
    })
    .then(res => res.status)

    if (login != 200) {
        if (debug) {
            console.log("A")
            console.log(login)
            console.log("B")
        }
        console.log("[", "BAD".red, "]", "Failed to login")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Logged in")
    }

    // test doing a wrong token login

    let loginWrong = await fetch("http://localhost:8008/api/login", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            token: "im lying to you!!"
        })
    })
    .then(res => res.json())

    if (loginWrong) {
        if (debug) {
            console.log(await loginWrong.json());
        }
        console.log("[", "BAD".red, "]", "Succeeded in logging in with a wrong token")
        failed["f"] = true;
    }

    // test getting a new token

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
        if (debug) {
            console.log(freshLogin)
        }
        console.log("[", "BAD".red, "]", "Failed to freshLogin")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "fresh logged in")
    }

    // test getting a new token with wrong password

    let freshLoginWrong = await fetch("http://localhost:8008/api/freshLogin", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            password: "im lying to you p2!!!!"
        })
    })
    .then(res => res.json())

    if (freshLoginWrong[0]) {
        if (debug) {
            console.log(await freshLoginWrong.json());
        }
        console.log("[", "BAD".red, "]", "Succeeded in fresh logging in with a wrong password")
        failed["f"] = true;
    }

    // return the token for future use
    return freshLogin[1]
}