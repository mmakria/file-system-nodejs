const fs = require("fs");

const content = fs.readFileSync("./text.txt");
const contentDecoded = content.toString("utf-8");
console.log(contentDecoded);
