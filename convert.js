// this is used if you want to change the format that stuff is saved
// (changes it from a db file to a json file)

const fs = require('fs');
const { QuickDB } = require("quick.db");

let levels = JSON.parse(fs.readFileSync("./levels.json", "utf8"));

let levelDB = new QuickDB({ filePath: './db/levelinformation.db'});

async function t() {
    await levelDB.deleteAll();

    for (let i = 0; i < levels.length; i++) {
        await levelDB.set(levels[i].id, levels[i]);
    }

console.log(await levelDB.all());
}

t();