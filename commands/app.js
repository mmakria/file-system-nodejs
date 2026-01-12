/**
 * On importe le module fs/promises.
 * Il permet de travailler avec le système de fichiers
 * en utilisant des promesses (async/await).
 */
const { unlink } = require("fs");
const fs = require("fs/promises");

/**
 * IIFE (Immediately Invoked Function Expression)
 * Cette fonction async s’exécute immédiatement.
 * Elle permet d’utiliser await au niveau global.
 */
(async () => {
  //commands

  const CREATE_FILE = "create a file";
  const DELETE_FILE = "delete the file";
  const RENAME_FILE = "rename the file";
  const ADD_TO_FILE = "add to the file";

  const createFile = async (path) => {
    try {
      const existingFileHandle = await fs.open(path, "r");
      // on a le fichiers
      existingFileHandle.close();
      return console.log(`The file ${path} already exists`);
    } catch (error) {
      // on n'a pas le fichiers
      const newFileHandle = await fs.open(path, "w");
      console.log("A new file was successfully created");
      newFileHandle.close();
    }
  };

  const deleteFile = async (path) => {
    console.log(`Deleting ${path}...`);
    try {
      // const existingFileHandle = await fs.open(path, "r");
      await fs.unlink(path);
    } catch (error) {
      console.log(error);
    }
  };
  const renameFile = async (oldPath, newPath) => {
    console.log(`Renaming ${oldPath} to ${newPath}...`);
  };

  const addToFile = async (path, content) => {
    console.log(`Adding to ${path}...`);
    try {
      const existingFileHandle = await fs.open(path, "w");
      existingFileHandle.appendFile(content);
      existingFileHandle.close();
    } catch (error) {
      console.log("An error happened: " + error);
    }
    console.log(`Content:  ${content}`);
  };

  /**
   * On ouvre le fichier command.txt en mode lecture ("r").
   * Cela retourne un FileHandle (descripteur de fichier).
   * Ce descripteur sera utilisé pour lire le fichier.
   */
  const commandFileHandler = await fs.open("./command.txt", "r");
  commandFileHandler.on("change", async () => {
    console.log("the file was changed");

    /**
     * On récupère les informations du fichier (stat).
     * .size correspond à la taille du fichier en octets.
     */
    const size = (await commandFileHandler.stat()).size;

    /**
     * On crée un buffer de la taille exacte du fichier.
     * Le buffer va contenir les données lues.
     */
    const buff = Buffer.alloc(size);

    /**
     * offset : position dans le buffer où écrire
     * position : position dans le fichier où commencer la lecture
     * length : nombre d’octets à lire
     */
    const offset = 0;
    const position = 0;
    const length = buff.byteLength;

    /**
     * On lit le fichier et on remplit le buffer.
     * read retourne un objet avec bytesRead et buffer.
     */
    await commandFileHandler.read(buff, offset, length, position);
    const command = buff.toString("utf-8");

    // ---------------------------   create a file - ---------------------------------------------

    if (command.includes(CREATE_FILE)) {
      const filePath = command.substring(CREATE_FILE.length + 1);
      createFile(filePath);
    }

    // ---------------------------   delete a file - ---------------------------------------------

    if (command.includes(DELETE_FILE)) {
      const filePath = command.substring(DELETE_FILE.length + 1);
      deleteFile(filePath);
    }

    // ---------------------------   rename a file - ---------------------------------------------
    if (command.includes(RENAME_FILE)) {
      const _idx = command.indexOf(" to ");
      const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
      const newFilePath = command.substring(_idx + 4);
      renameFile(oldFilePath, newFilePath);
    }

    // ---------------------------   adding to a file - ---------------------------------------------
    // add to the file <path> this content: <content>
    if (command.includes(ADD_TO_FILE)) {
      const _idx = command.indexOf(" this content: ");
      const filePath = command.substring(RENAME_FILE.length + 1, _idx);
      const content = command.substring(_idx + 15);
      addToFile(filePath, content);
    }
  });

  /**
   * fs.watch permet d’écouter les changements sur un fichier.
   * Ici, on surveille command.txt.
   * watcher est un AsyncIterator.
   */
  const watcher = fs.watch("./command.txt");

  /**
   * for await...of permet de boucler sur des événements asynchrones.
   * Chaque fois que le fichier change, un événement est émis.
   */
  for await (const event of watcher) {
    /**
     * event.eventType indique le type d’événement.
     * "change" signifie que le contenu du fichier a été modifié.
     */
    if (event.eventType === "change") {
      commandFileHandler.emit("change");
    }
  }
})();

/**
 * ========================= RÉSUMÉ fs / fs-promises / FileHandle =========================
 *
 * 1) fs/promises
 * -----------------------------------------------------------------------------
 * - fs/promises est l’API moderne de Node.js pour le système de fichiers.
 * - Toutes les fonctions retournent des PROMESSES (utilisables avec async/await).
 * - Ces fonctions travaillent directement avec des CHEMINS de fichiers (string).
 *
 *   Exemples (PAS de FileHandle) :
 *     - fs.readFile(path)
 *     - fs.writeFile(path, data)
 *     - fs.stat(path)
 *     - fs.rename(oldPath, newPath)
 *     - fs.rm(path)
 *     - fs.watch(path)
 *
 *   → Node ouvre le fichier, fait l’action, puis le referme automatiquement.
 *
 *
 * 2) FileHandle
 * -----------------------------------------------------------------------------
 * - FileHandle représente un FICHIER OUVERT.
 * - On obtient un FileHandle UNIQUEMENT avec fs.open().
 * - Tant que le fichier est ouvert, on travaille dessus via le FileHandle.
 *
 *   Exemple :
 *     const handle = await fs.open("file.txt", "r");
 *
 * - Les méthodes du FileHandle :
 *     - handle.read()
 *     - handle.write()
 *     - handle.stat()
 *     - handle.close()
 *
 *   → Ici, c’est le développeur qui gère l’ouverture et la fermeture du fichier.
 *
 *
 * 3) Règles importantes à retenir
 * -----------------------------------------------------------------------------
 * - SANS fs.open() → PAS de FileHandle.
 * - Avec fs.open() → on obtient un FileHandle.
 * - fs/promises (path) = API simple, automatique (99% des cas).
 * - FileHandle = API avancée (lecture par buffer, performance, contrôle).
 *
 *
 * 4) async / await (rappel)
 * -----------------------------------------------------------------------------
 * - await nécessite une fonction async (ou top-level await).
 * - async/await n’a RIEN à voir avec FileHandle.
 * - FileHandle dépend uniquement de fs.open().
 *
 * =============================================================================
 */
