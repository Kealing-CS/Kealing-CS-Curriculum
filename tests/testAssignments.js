const colors = require("colors")

// failed is passed as an object so that it can be modified by reference
module.exports = async function (token, failed, debug) {

    /* ############## */
    /* ### SUBMIT ### */
    /* ############## */

    let cookies = {
        headers: {
            "cookie": `username=test; token=${token}`
        }
    }

    let submitWrong = await fetch("http://localhost:8008/api/submit", {
        method: "POST",
        body: JSON.stringify({
            level: "start",
            code: {
                html: "htmlcode",
                js: "jscode",
                css: "csscode"
            }
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "cookie": `username=test; token=${token}`
        }
    })
    .then(res => res.status)

    if (submitWrong === 200) {
        if (debug) {
            console.log(submitWrong)
        }
        console.log("[", "BAD".red, "]", "Wrong output for wrong code")
        failed = true;
    } else {
        console.log("[", "OK".green, "]", "Right output for wrong code")
    }

    let submitRight = await fetch("http://localhost:8008/api/submit", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "cookie": `username=test; token=${token}`
        },
        body: JSON.stringify({
            level: "start",
            code: {
                html: "<div id='test'></div>",
                js: "console.log('Hello, world!')",
                css: "#test {background-color: red;}"
            }
        })
    })
    .then(res => res.status)

    if (!submitRight === 200) {
        if (debug) {
            console.log(submitRight)
        }
        console.log("[", "BAD".red, "]", "Wrong output for right code")
        failed = true;
    } else {
        console.log("[", "OK".green, "]", "Right output for right code")
    }

    /* ################ */
    /* ### GET CODE ### */
    /* ################ */

    let getCode = await fetch(`http://localhost:8008/api/getCode?level=start`, cookies)
    if (getCode.status !== 200) {
        if (debug) {
            console.log(getCode.status)
        }
        console.log("[", "BAD".red, "]", "Wrong status code for get code")
        failed["f"] = true;
    } else {
        let tempfailed = false;
        let code = await getCode.json()
        if (code.html !== "<div id='test'></div>") {
            if (debug) {
                console.log(code.html)
            }
            console.log("[", "BAD".red, "]", "Wrong HTML for get code")
            tempfailed = true;
        }
        if (code.js !== "console.log('Hello, world!')") {
            if (debug) {
                console.log(code.js)
            }
            console.log("[", "BAD".red, "]", "Wrong JS for get code")
            tempfailed = true;
        }
        if (code.css !== "#test {background-color: red;}") {
            if (debug) {
                console.log(code.css)
            }
            console.log("[", "BAD".red, "]", "Wrong CSS for get code")
            tempfailed = true;
        }
        failed["f"] = tempfailed || failed["f"];
        if (!tempfailed) {
            console.log("[", "OK".green, "]", "Right output for get code")
        }
    }

    /* ################ */
    /* ### SET CODE ### */
    /* ################ */

    let setCode = await fetch("http://localhost:8008/api/setCode", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "cookie": `username=test; token=${token}`
        },
        body: JSON.stringify({
            level: "start",
            code: {
                html: "<div id='test'></div>",
                js: "console.log('Hello, world!')",
                css: "#test {background-color: red;}"
            }
        })
    })
    .then(res => res.status)

    if (setCode !== 200) {
        if (debug) {
            console.log(setCode)
        }
        console.log("[", "BAD".red, "]", "Wrong status code for set code")
        failed["f"] = true;
    } else {
        console.log("[", "OK".green, "]", "Right status code for set code")
    }

    /* ##################### */
    /* ### GET COMPLETED ### */
    /* ##################### */

    let getCompleted = await fetch("http://localhost:8008/api/getCompleted?user=test")

    if (getCompleted.status !== 200) {
        if (debug) {
            console.log(getCompleted.status)
        }
        console.log("[", "BAD".red, "]", "Wrong status code for get completed")
        failed["f"] = true;
    } else {
        // have to do this stupid ass thing because js is a dumbass language
        if ((await getCompleted.json()).length !== 0) {
            if (debug) {
                console.log(getCompleted.json())
            }
            console.log("[", "BAD".red, "]", "Wrong output for get completed")
            failed["f"] = true;
        }
    }

    /* #################### */
    /* ### GET UNLOCKED ### */
    /* #################### */

    let getUnlocked = await fetch("http://localhost:8008/api/getUnlocked?user=test")

    if (getUnlocked.status !== 200) {
        if (debug) {
            console.log(getUnlocked.status)
        }
        console.log("[", "BAD".red, "]", "Wrong status code for get unlocked")
        failed["f"] = true;
    } else {
        if (JSON.stringify((await getUnlocked.json()).sort()) !== JSON.stringify(["start", "sandbox"].sort())) {
            console.log("[", "BAD".red, "]", "Wrong output for get unlocked")
            failed["f"] = true;
        }
    }
}
