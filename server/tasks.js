var fs = require("fs");
module.exports.addListener = function (name, time, callBack) {
  var parsed = JSON.parse();
};
/* 
Database structure will be like:
[{"name":object | string,"date":Date object,callback:string ( Will be evailed) }]
*/
module.exports.removeListener = function (by) {};
module.exports.listen = function () {
    var listeners = [];
    var ldata = [];
  fs.readFile("./db/tasks.json", addListeners);
  fs.watchFile("./db/tasks.json", addListeners);
  /**
   *
   * @param { Array } newc
   * @param { Array } oldc
   */
  async function addListeners(newc, oldc) {
    if (typeof oldc === "undefined") {
      oldc = "[]";
    }
    newc = JSON.parse(newc);
    oldc = JSON.parse(oldc);
    var lisenersToAdd = newc.filter((value) => !oldc.includes(value));
    lisenersToAdd.forEach((value, i) => {
      // Time is in ms
      var sleep = (ms) => new Promise((res) => setTimeout(ms, res));
      var delay = (new Date(value.date).getMilliseconds()) - (new Date().getMilliseconds());
      if(delay<1){

      }else{
        listeners.push(sleep((new Date(value.date).getMilliseconds()) - (new Date().getMilliseconds())));
      }
    });
  }
};
