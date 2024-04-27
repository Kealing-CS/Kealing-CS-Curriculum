var fs = require("fs");
const Time = require("timers/promises");
var liseners = [];
/**
 * 
 * @param { Array} newc 
 * @param { Array } oldc 
 */
function addLiseners(newc, oldc) {
  newc = JSON.parse(newc);
  oldc = JSON.parse(oldc);
  var lisenersToAdd = newc.filter(value => !oldc.includes(value));
  lisenersToAdd.forEach((value,i) => {
    // Time is in ms
   Time.setTimeout()
  });
}
fs.watchFile("./db/tasks.json", addLiseners);
