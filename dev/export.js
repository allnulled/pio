const fs = require("fs");

const src = fs.readFileSync(__dirname + "/../src/pio.js").toString();
const srcReversed = src.split("").reverse().join("");
const srcReversedCorrected = srcReversed.replace("= stropxe.eludom", "tluafed tropxe");
const dst = srcReversedCorrected.split("").reverse().join("");
fs.writeFileSync(__dirname + "/../src/pio.es6.js", dst, "utf8");
console.log("Successfully exported to es6 notation");