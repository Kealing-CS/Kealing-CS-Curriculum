if (process.argv.indexOf("--reset") === -1 && process.argv.indexOf("-R") === -1) {
    console.log("Please include the --reset flag in the start script")
    process.exit()
}

require("./server/server")

async function t() {

    let create = await fetch("http://localhost:8008/api/createAccount", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            password: "test"
        })
    })
    .then(res => res.json())
    if (create[0] !== true) {
        console.log("Failed to create account")
        process.exit(1)
    }

    let login = await fetch("http://localhost:8008/api/login", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            token: create[2]
        })
    })
    .then(res => res.json())
    
    if (login[0] !== true) {
        console.log("Failed to login")
        process.exit(1)
    }

    let freshLogin = await fetch("http://localhost:8008/api/freshLogin", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            password: "test"
        })
    })
    .then(res => res.json())


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
        console.log("Wrong output for wrong code")
        process.exit(1)
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
        console.log("Wrong output for right code")
        process.exit(1)
    }

    console.log("All tests passed!")
    process.exit(0)
}

t()