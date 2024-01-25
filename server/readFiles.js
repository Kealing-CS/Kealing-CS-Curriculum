// this gets all the files in a directory and subdirectories

const fs = require('fs');

function readFiles(path) {
    let flat = [];
    let all = fs.readdirSync(path, {withFileTypes: true})
    .map(item => item.name)
    .filter(item => item[0] !== "_")

    all.forEach(item => {
        // check if it ends with .js
        if (item.slice(-3) === ".js") {
            flat.push(item);
        } else {
            // recurse
            let sub = readFiles(`${path}/${item}`);
            sub.forEach(subItem => {
                flat.push(`${item}/${subItem}`);
            })
        }
    })
    return flat;
}

module.exports = (path) => readFiles(path);