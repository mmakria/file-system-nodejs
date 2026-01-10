/**
 * On importe le module fs/promises.
 * Il permet de travailler avec le système de fichiers
 * en utilisant des promesses (async/await).
 */
const fs = require("fs/promises");

/**
 * IIFE (Immediately Invoked Function Expression)
 * Cette fonction async s’exécute immédiatement.
 * Elle permet d’utiliser await au niveau global.
 */
(async () => {
  /**
   * On ouvre le fichier command.txt en mode lecture ("r").
   * Cela retourne un FileHandle (descripteur de fichier).
   * Ce descripteur sera utilisé pour lire le fichier.
   */
  const commandFileHandler = await fs.open("./command.txt", "r");

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
      const content = await commandFileHandler.read(
        buff,
        offset,
        length,
        position
      );

      /**
       * Affiche l’objet retourné par read.
       * Pour voir le texte lisible :
       * console.log(buff.toString("utf-8"))
       */
      console.log(content);
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
