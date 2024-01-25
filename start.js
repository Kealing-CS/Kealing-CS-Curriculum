// this is for the funnsies

var fs = require('fs')

if (process.argv.indexOf("--reset") > -1 || process.argv.indexOf("-R") > -1) {
    console.log("Resetting database...")
    fs.writeFileSync('./db/sensitivedata.db', '')
    fs.writeFileSync('./db/userdata.db', '')
    fs.writeFileSync('./db/admins.json', '[]')
    console.log("Done!")
}

if (process.argv.indexOf("--test") > -1 || process.argv.indexOf("-T") > -1) {
    require("./tests/test")
} else {
    require("./server/server")
}