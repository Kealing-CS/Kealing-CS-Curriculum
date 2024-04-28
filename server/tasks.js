var fs = require("fs");
var path = "./db/tasks.json";
class listenerTemplete {
  tmod;
  constructor(name, ms, callBack) {
    console.log(...arguments);

    this.tmod = new setTimeout(this.handeler, ms);
    this.tmod.callBack = callBack;
    this.tmod.tname = name;
    this.tmod.cancelled = false;
    this.tmod.ready = true;
    this.tmod.h = this.handeler;
  }
  handeler() {
    var onReady = function () {
      if (!this.cancelled) {
        eval(this.callBack);
      }
      var temp = JSON.parse(fs.readFileSync(path)),
        name = this.tname;
      temp.splice(
        temp.findIndex((val) => val.name === name),
        1
      );
      fs.writeFileSync(path, JSON.stringify(temp));
    };
    if (typeof this.ready != "undefined") {
      onReady.call(this);
    } else {
      //console.log("Failed, retrying");
      this.h.call(this);
    }
  }
  remove() {
    this.tmod.cancelled = true;
  }
}
module.exports.addListener = function (name, time, callBack) {
  var ingen = {};
  ingen.name = name;
  ingen.time = time;
  ingen.callBack = callBack;
  var gened = JSON.parse(fs.readFileSync(path));
  gened.push(ingen);
  fs.writeFileSync(path, JSON.stringify(gened));
};
/* 
Database structure will be like:
[{"name":object | string,"date":Date object,callback:string ( Will be evailed) }]
*/
module.exports.removeListener = function (name) {
  var temp = JSON.parse(fs.readFileSync(path));
  temp.splice(
    temp.findIndex((val) => val.name === name),
    1
  );
  fs.writeFileSync(path, JSON.stringify(temp));
};
module.exports.listen = function () {
  var listeners = [];
  var catched = "[]";
  addListeners();
  fs.watchFile(path, addListeners);

  async function addListeners() {
    var newc = JSON.parse(fs.readFileSync(path)),
      oldc;
    if (typeof catched === "undefined") {
      oldc = [];
    } else {
      oldc = JSON.parse(catched);
    }
    catched = JSON.stringify(newc);
    var lisenersToAdd = newc.filter((value) => !oldc.includes(value));
    var lisenersToRemove = oldc.filter((value) => !newc.includes(value));
    lisenersToRemove.forEach((value, i) => {
      listeners[ldata.indexOf(value.name)].remove();
    });
    lisenersToAdd.forEach((value, i) => {
      // Time is in ms
      var delay = new Date(value.time).getTime() - new Date().getTime();
      if (delay < 1) {
        var temp = JSON.parse(fs.readFileSync(path).toString()),
          name = value.name;
        temp.splice(
          temp.findIndex((val) => val.name === name),
          1
        );
        fs.writeFileSync(path, JSON.stringify(temp));
        eval(value.callBack);
      } else {
        listeners.push(new listenerTemplete(value.name, delay, value.callBack));
      }
    });
  }
};
