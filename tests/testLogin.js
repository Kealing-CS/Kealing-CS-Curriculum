const colors = require("colors")

module.exports = async function (failed, debug) {
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
        if (debug) {
            console.log(createShortU)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short username")
        failed["f"] = true;
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
        if (debug) {
            console.log(createShortP)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a short password")
        failed["f"] = true;
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
        if (debug) {
            console.log(createLongU)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long username")
        failed["f"] = true;
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
        if (debug) {
            console.log(createLongP)
        }
        console.log("[", "BAD".red, "]", "Succeeded in creating an account with a long password")
        failed["f"] = true;
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
        if (debug) {
            console.log(createNACU)
        }
        console.log("[", "BAD".red, "]", "Succeeded to create account with bad username")
        failed["f"] = true;
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
        if (debug) {
            console.log(createNACP)
        }
        console.log("[", "BAD".red, "]", "Succeeded to create account with bad password")
        failed["f"] = true;
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

    // return the token for future use
    return freshLogin[1]
}