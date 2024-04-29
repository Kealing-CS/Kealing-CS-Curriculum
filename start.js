// this is for the funnsies
const { QuickDB } = require("quick.db");
var fs = require('fs')


if (process.argv.indexOf("--reset") > -1 || process.argv.indexOf("-R") > -1) {
    console.log("Resetting database...")
    const userDB = new QuickDB({ filePath: './db/userdata.db'});
    fs.writeFileSync('./db/sensitivedata.db', '')
    userDB.set("users", {})
    userDB.set("teacherRequests", [])
    fs.writeFileSync('./db/admins.json', '[]')
    console.log("Done!")
}

if (process.argv.indexOf("--test") > -1 || process.argv.indexOf("-T") > -1) {
    require("./tests/test")
} else {
    require("./server/server").start()
}