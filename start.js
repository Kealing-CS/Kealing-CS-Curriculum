
if (process.argv.indexOf("--test") > -1 || process.argv.indexOf("-T") > -1) {
    require("./test")
} else {
    require("./server/server")
}