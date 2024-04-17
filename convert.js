// this is used if you want to change the format that stuff is saved
// (changes it from a db file to a json file)

const { QuickDB } = require("quick.db");

let userDB = new QuickDB({ filePath: './db/userdata.db'});
let userDBTemp = new QuickDB({ filePath: './db/userdataTemp.db'});

async function t() {
    // write userDBTemp to userDB
    let all = await userDBTemp.all();
    all.forEach((item) => {
        userDB.set(item.id, item.value);
    })
}

t();