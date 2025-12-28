// Promises API
const fs = require("fs/promises");

(async () => {
  try {
    await fs.copyFile("file.txt", "copied-promises.txt");
  } catch (error) {
    console.log(error);
  }
})();

// Callback API
const fs1 = require("fs");

fs1.copyFile("file.txt", "copied-callback.txt", (error) => {
  if (error) console.log(error);
});

// Synchronous API

const fs2 = require("fs");
fs2.copyFileSync("file.txt", "copied-synchrounous.txt");
