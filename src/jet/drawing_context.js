import { Vector2 } from './vector_2.js';

export class DrawingContext {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasContext = canvas.getContext('2d');
        if (!this.canvasContext) {
            throw new Error('failed to get 2D context of HTML canvas');
        }
        this.canvasContext.imageSmoothingEnabled = false;
        this.canvasContext.fillStyle = 'white';
        this.position = new Vector2(0, 0);
    }

    /**
     * @param {HTMLImageElement} image
     * @param {import('./rectangle.js').Rectangle} srcRect
     * @param {import('./rectangle.js').Rectangle} dstRect
     */
    drawImage(image, srcRect, dstRect) {
        this.canvasContext.drawImage(
            image,
            srcRect.position.x,
            srcRect.position.y,
            srcRect.width,
            srcRect.height,
            this.position.x + dstRect.position.x,
            this.position.y + dstRect.position.y,
            dstRect.width,
            dstRect.height
        );
    }

    /**
     * @param {string} text
     * @param {Vector2} position
     * @param {number} size
     * @param {CanvasTextAlign} alignment
     */
    drawText(text, position, size, alignment) {
        this.canvasContext.font = size + 'px serif';
        this.canvasContext.textAlign = alignment;
        this.canvasContext.fillText(
            text,
            this.position.x + position.x,
            this.position.y + position.y
        );
    }

    /**
     * @param {import('./rectangle.js').Rectangle} rect
     * @param {string} color
     */
    drawRect(rect, color) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(
            rect.position.x,
            rect.position.y,
            rect.width,
            rect.height
        );
    }
}
