const flags = { Object: 0, Next: 1, NextArray: 2, NextObject: 3, Array: 4 };
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
Number.prototype.asBinary = function asBinary(byteLength = 3) {
  var input = this.toString(2);
  var output = [];
  console.log(input);
  while (input.length % byteLength != 0) {
    input = "0" + input;
  }
  if (input.length > byteLength) {
    for (var i = 1; (i-1) < input.length / byteLength; i++) {
      output.push(
        input.slice(
          (i * byteLength) - byteLength,
          i * byteLength
        )
      );
    }
  }
  return output;
};
if (Array.isArray(toEncode)) {
  genarating.push(flags.Array.toString(2));
} else {
}
console.log((1025).asBinary());
