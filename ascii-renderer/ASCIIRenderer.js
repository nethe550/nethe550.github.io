/**
 * @author nethe550
 * @license MIT
 * @description Takes image data and renders it into ASCII characters.
 */

/**
 * @typedef {[string]} ASCIIPalette - A palette of characters to use for ASCII rendering, sorted in descending order of density.
 */

/**
 * The ASCIIRenderer class.
 * @class
 */
class ASCIIRenderer {

    /**
     * A collection of default ASCII art palettes.
     * @enum
     */
    static Palettes = {

        /**
         * The standard ASCII art palette.
         * @enum
         * @type {ASCIIPalette}
         */
        Standard: [
            '$', '@', 'B', '%', '8', '&', 'W', 'M', '#', '*', 'o', 'a', 'h', 'k', 'b', 'd', 'p', 'q', 'w', 'm', 'Z', 'O', '0', 'Q', 'L', 'C', 'J', 'U', 'Y', 'X', 'z', 'c', 'v', 'u', 'n', 'x', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', '\'', '.', ' '
        ],

        /**
         * An alternate ASCII art palette.
         * @enum
         * @type {ASCIIPalette}
         */
        Alternate: [
            'M', 'Q', 'W', '#', 'B', 'N', 'q', 'p', 'H', 'E', 'R', 'm', 'K', 'd', 'g', 'A', 'G', 'b', 'X', '8', '@', 'S', 'D', 'O', '$', 'P', 'U', 'k', 'w', 'Z', 'y', 'F', '6', '9', 'h', 'e', 'T', '0', 'a', '&', 'x', 'V', '%', 'C', 's', '4', 'f', 'Y', '5', '2', 'L', 'o', 'n', 'z', '3', 'u', 'c', 'J', 'j', 'v', 'I', 't', 'r', '}', '{', 'l', 'i', '?', '1', ']', '[', '7', '<', '>', '=', ')', '(', '+', '*', '|', '!', '/', '\\', ';', ':', '-', ',', '"', '_', '~', '^', '.', '\'', '`'
        ],

        /**
         * A short version of the standard ASCII art palette.
         */
        Short: [
            '@', '%', '#', '*', '+', '=', '-', ':', '.', ' '
        ],

        /**
         * The shading ASCII art palette.
         * @enum
         * @type {ASCIIPalette}
         */
        Shading: [
            '▓', '▒', '░'
        ]

    };

    /**
     * Generates an ASCII string representation of the specified image.
     * @param {ImageData} imageData - The grayscale image data to convert to ASCII.
     * @param {number} scale - The scale at which to render the image at. (0.1 to 1)
     * @param {ASCIIPalette} palette - The character palette to render with.
     * @returns {string} The ASCII representation of the given image.
     */
    static render(imageData, scale, palette) {

        if (scale > 1) scale = 1;
        else if (scale < 0.1) scale = 0.1;

        scale = ASCIIRenderer.scale(scale, 0.1, 1, 1, 10);

        let ascii = '';

        for (let y = 0; y < imageData.height; y += scale) {

            for (let x = 0; x < imageData.width; x += scale) {

                const i = ( y * 4) * imageData.width + x * 4;
                
                // find the closest corresponding character for this pixel brightness
                let char = Math.round(ASCIIRenderer.scale(imageData.data[i], 0, 255, 0, palette.length - 1));
                ascii += palette[char] + ' ';

            }

            ascii += '\n';

        }

        if (ascii.indexOf('undefined') != -1) return ascii = "This image can not be displayed at the current scale level. Try adjusting it to fit a multiple of the width / height of the image.";

        return ascii;

    }

    /**
     * Converts an image to its grayscale format.
     * @param {ImageData} imageData - The image to convert to grayscale.
     * @param {boolean} ignoreTransparent - Whether or not to ignore transparent pixels.
     * @param {boolean} ignoreWhite - Whether or not to ignore white pixels.
     * @param {number} ignoreThreshold - The threshold at which to start ignoring transparent or white pixels.
     * @returns {ImageData} The grayscale image.
     */
    static grayscale(imageData, ignoreTransparent=true, ignoreWhite=true, ignoreThreshold=16) {

        for (let y = 0; y < imageData.height; y++) {

            for (let x = 0; x < imageData.width; x++) {

                let i = (y * 4) * imageData.width + x * 4;

                let avg;

                // treat transparency as white
                if (ignoreTransparent && imageData.data[i + 3] < ignoreThreshold) avg = 255;
                // treat close to white as white
                else if (ignoreWhite && ((
                    imageData.data[i] +
                    imageData.data[i + 1] +
                    imageData.data[i + 2]
                ) / 3) > 255 - ignoreThreshold) avg = 255;
                else avg = (
                    imageData.data[i] + 
                    imageData.data[i + 1] +
                    imageData.data[i + 2]
                ) / 3;

                imageData.data[i] = avg;
                imageData.data[i + 1] = avg;
                imageData.data[i + 2] = avg;

            }

        }

        return imageData;

    }

    static scale(value, inmin, inmax, outmin, outmax) {
        return (value - inmin) * (outmax - outmin) / (inmax - inmin) + outmin;
    }

}