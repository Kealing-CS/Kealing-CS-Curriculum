const fs = require('fs')
const colors = require('colors')
const testlogin = require('./testLogin')
const testAssignments = require('./testAssignments')

if (process.argv.indexOf("--reset") > -1 || process.argv.indexOf("-R") > -1) {
    console.log("Resetting database...")
    fs.writeFileSync('./db/sensitivedata.db', '')
    fs.writeFileSync('./db/userdata.db', '')
    fs.writeFileSync('./db/admins.json', '[]')
    console.log("Done!")
}

const { start } = require("../server/server")

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

async function test(server) {
    let failed = false;
    let debug = process.argv.indexOf("--debug") > -1

    try {
        // pass failed by reference so that it can be modified by the test functions
        temp = {"f": failed}
        let token = await testlogin(temp, debug);
        await testAssignments(token, temp, debug);

        if (!temp["f"]) {
            console.log("[", "OK".green, "]", "All tests passed!")
            await server.kill()
            process.exit(0)
        } else {
            console.log("[", "BAD".red, "]", "Some tests failed")
            await server.kill()
            process.exit(1)
        }
    } catch(e) {
        console.log("[", "BAD".red, "]", "Error in test script")
        if (debug) {
            console.log(e)
        } else {
            console.log(e.stack)
        }
        await server.kill()
        process.exit(1)
    }
}
// Ignore a broken cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
start().then(test);