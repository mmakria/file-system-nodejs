const fs = require("fs/promises");

//open (32) file descriptor
//read or write

(async () => {
  const commandFileHandler = await fs.open("./command.txt", "r");
  const watcher = fs.watch("./command.txt");

  // async iterator
  // permet de boucler des elements asynchrone

  for await (const event of watcher) {
    if (event.eventType === "change") {
      // the file was changed
      console.log("the file was changed");
      //We want to read the content ...

      //get the size of the file
      const size = (await commandFileHandler.stat()).size;
      const buff = Buffer.alloc(size);
      const offset = 0;
      const position = 0;
      const length = buff.byteLength;

      const content = await commandFileHandler.read(
        buff,
        offset,
        length,
        position
      );
      console.log(content);
    }
  }
})();
