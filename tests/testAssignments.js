const colors = require("colors")

// failed is passed as an object so that it can be modified by reference
module.exports = async function (token, failed) {

    /* ############## */
    /* ### SUBMIT ### */
    /* ############## */

    let submitWrong = await fetch("http://localhost:8008/api/submit", {
        method: "POST",
        body: JSON.stringify({
            user: "test",
            token: token,
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
    .then(res => res.status)

    if (submitWrong === 200) {
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
            token: token,
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
        console.log("[", "BAD".red, "]", "Wrong output for right code")
        failed = true;
    } else {
        console.log("[", "OK".green, "]", "Right output for right code")
    }

    /* ################ */
    /* ### GET CODE ### */
    /* ################ */

    let getCode = await fetch("http://localhost:8008/api/getCode?user=test&token=" + token + "&level=start")

    if (getCode.status !== 200) {
        console.log("[", "BAD".red, "]", "Wrong status code for get code")
        failed["f"] = true;
    } else {
        let tempfailed = false;
        let code = await getCode.json()
        if (code.html !== "<div id='test'></div>") {
            console.log("[", "BAD".red, "]", "Wrong HTML for get code")
            tempfailed = true;
        }
        if (code.js !== "console.log('Hello, world!')") {
            console.log("[", "BAD".red, "]", "Wrong JS for get code")
            tempfailed = true;
        }
        if (code.css !== "#test {background-color: red;}") {
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
            "content-type": "application/json"
        },
        body: JSON.stringify({
            user: "test",
            token: token,
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
        console.log("[", "BAD".red, "]", "Wrong status code for get completed")
        failed["f"] = true;
    } else {
        // have to do this stupid ass thing because js is a dumbass language
        if ((await getCompleted.json()).length !== 0) {
            console.log("[", "BAD".red, "]", "Wrong output for get completed")
            failed["f"] = true;
        }
    }

    /* #################### */
    /* ### GET UNLOCKED ### */
    /* #################### */

    let getUnlocked = await fetch("http://localhost:8008/api/getUnlocked?user=test")

    if (getUnlocked.status !== 200) {
        console.log("[", "BAD".red, "]", "Wrong status code for get unlocked")
        failed["f"] = true;
    } else {
        if (JSON.stringify((await getUnlocked.json()).sort()) !== JSON.stringify(["start", "sandbox"].sort())) {
            console.log("[", "BAD".red, "]", "Wrong output for get unlocked")
            failed["f"] = true;
        }
    }
}
