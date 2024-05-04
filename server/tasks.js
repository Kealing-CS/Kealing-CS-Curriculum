var fs = require("fs");
var vm = require("vm");
var path = "./db/tasks.json";
class listenerTemplete {
  i = 0;
  ms;
  reps;
  callBack;
  name;
  cancelled = false;
  vars;
  constructor(name, ms, callBack, vars) {
    console.log("created listener");
    var reps = ms > 2147483647 ? Math.trunc(ms / 2147483647) : false;
    this.ms = ms;
    this.reps = reps;
    this.callBack = callBack;
    this.name = name;
    this.vars = vars;
    if (reps) {
      this.interval = setInterval(() => this.onInterval(),2147483647);
    } else {
      setTimeout(() => this.run(), ms);
    }
  }

  onInterval() {
    if (this.i === this.reps && this.cancelled === false) {
      setTimeout(() => this.run(), this.ms % 2147483647);
    } else if (this.i < this.reps) {
      this.i++;
    }
  }
  run() {
    console.log("runing");
    var temp = JSON.parse(fs.readFileSync(path).toString());
    temp.splice(
      temp.findIndex((val) => val.name === this.name),
      1
    );
    fs.writeFileSync(path, JSON.stringify(temp));
    vm.runInContext(this.callBack, this.vars);
  }
  remove() {
    this.cancelled = false;
  }
}
module.exports.addListener = function (name, time, callBack) {
  var ingen = {};
  ingen.name = name;
  ingen.time = time;
  ingen.callBack = callBack;
  var gened = JSON.parse(fs.readFileSync(path));
  if (typeof gened.find(value => value.name === name) !== "undefined") {
    return false;
  }
  gened.push(ingen);
  fs.writeFileSync(path, JSON.stringify(gened));
  return true;
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
module.exports.exists = function (name) {
  return (
    typeof JSON.parse(fs.readFileSync(path)).map((val) => val.name === name)[
      name
    ] != "undefined"
  );
};
module.exports.get = function (name) {
  return JSON.parse(fs.readFileSync(path)).filter((val) => val.name === name);
};
module.exports.listen = function (varablesToPass) {
  var listeners = [];
  var catched = "[]";
  vm.createContext(varablesToPass);
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
      if (
        typeof listeners[
          listeners.map((val) => val.name === value.name).indexOf(true)
        ] != "undefined"
      ) {
        listeners[
          listeners.map((val) => val.name === value.name).indexOf(true)
        ].remove();
      }
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
        vm.runInContext(value.callBack, varablesToPass);
      } else {
        listeners.push(
          new listenerTemplete(
            value.name,
            delay,
            value.callBack,
            varablesToPass
          )
        );
      }
    });
  }
};
