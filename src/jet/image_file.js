export class ImageFile {
    /**
     * @param {Document} htmlDocument
     * @param {string} relPath
     * @param {(a: ImageFile) => void} onLoaded
     */
    constructor(htmlDocument, relPath, onLoaded) {
        this.relPath = relPath;
        this.onLoaded = onLoaded;
        this.htmlElement = htmlDocument.createElement('img');
        this.htmlElement.onload = () => {
            this.onLoaded(this);
        };
        this.htmlElement.src = relPath;
    }
}
