// this is for the funnsies
const { QuickDB } = require("quick.db");
const { chdir, cwd } = process;
var fs = require("fs");
while(true){
    if(fs.existsSync("./.git")){
       break;
    }else{
    chdir("../");
    }
}
if (process.argv.indexOf("--test") > -1 || process.argv.indexOf("-T") > -1) {
  require("./tests/test");
} else {
  if (process.argv.indexOf("--reset") > -1 || process.argv.indexOf("-R") > -1) {
    console.log("Resetting database...");
    const userDB = new QuickDB({ filePath: "./db/userdata.db" });
    fs.writeFileSync("./db/sensitivedata.db", "");
    userDB.set("users", {});
    userDB.set("teacherRequests", []);
    fs.writeFileSync("./db/admins.json", "[]");
    console.log("Done!");
  }
  require("./server/server").start();
}
