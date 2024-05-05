Number.prototype.asBinary = function asBinary(byteLength = 2) {
  var input = this.toString(2);
  var output = [];
  while (input.length % byteLength != 0) {
    input = "0" + input;
  }
  for (var i = 1; i - 1 < input.length / byteLength; i++) {
    output.push(input.slice(i * byteLength - byteLength, i * byteLength));
  }
  return output;
};
String.prototype.asBinary = function (...args) {
  return Number(this).asBinary(...args);
};
const flags = { Next: 0, Object: 1, Array: 2, End: 3 };
Object.keys(flags).forEach((value) => (flags[value] = flags[value].asBinary()));
const fs = require("fs");
//var file = fs.readFileSync("./test.db");
var toEncode = {
  chickens: [
    "cool",
    "great",
    "Don't eat",
    { why: ["they are cool", "Because I said so"] },
  ],
};
var genarating = [];
function processObject(dvalue) {
  var gening = [];
  genarating.push(...flags.Object);
  var keys = Object.keys(dvalue);
  keys.forEach((key) => {
    let value = dvalue[key];
    if (typeof value == "string" || value instanceof String) {
      gening.push(...[key, ...flags.Next, value]);
    } else if (Array.isArray(value)) {
      gening.push(...[key, ...processArray(value)]);
    } else if (typeof val == "object") {
      gening.push(...[...processObject(val), flags.End]);
    }
  });
  return gening;
}
function processArray(value) {
  return [
    ...flags.Array,
    ...value
      .map((val, i) => {
        if (Array.isArray(val)) {
          val = processArray(val);
          return i == value.length - 1 ? [...val] : [...val, ...flags.Next];
        } else if (typeof val == "object") {
          return [...processObject(val), flags.End];
        } else if (typeof val == "string" || val instanceof String) {
          genarating.push(...[...flags.Next, val]);
        }
      })
      .flat(1),
    ...flags.End,
  ];
}
if (Array.isArray(toEncode)) {
  genarating.push(...flags.Array);
} else {
  genarating.push(...flags.Object);
  var keys = Object.keys(toEncode);
  keys.forEach((key) => {
    let value = toEncode[key];
    if (typeof value == "string" || value instanceof String) {
      genarating.push(...[key, ...flags.Next, value]);
    } else if (Array.isArray(value)) {
      genarating.push(...[key, ...processArray(value)]);
    }
  });
}
console.log((0).asBinary());
console.log("1025".asBinary());
console.log(genarating, "Genarated");
