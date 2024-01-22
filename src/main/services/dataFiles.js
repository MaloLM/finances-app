const path = require("path");
const fs = require("fs");
const { app } = require('electron');

/**
 * Reads a JSON file and returns its content.
 * If the file is empty, an empty object is returned. If there's an error in parsing the JSON,
 * the function writes an empty object to the file and then resolves with an empty object.
 *
 * @param {string} filename - The name of the file to be read.
 * @returns {Promise<Object|string>} A promise that resolves with the content of the JSON file
 *                                   as an object, or as a raw string if the file is empty.
 *                                   Rejects with an error if the file cannot be read.
 */

function getDataFilePath(filename) {
  // Check if the app is running in production (packaged)
  if (app.isPackaged) {
    // Path for read-only data inside the asar package
    return path.join(__dirname, filename);
  } else {
    // Development path
    return path.join(__dirname, '..', 'src', 'data', filename);
  }
}

function readJsonFile(filename) {
  return new Promise((resolve, reject) => {
    const filePath = getDataFilePath(filename)

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          if (data != "") {
            resolve(data);
          } else {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          }
        } catch (parseErr) {
          writeJsonFile(filename, {});
          resolve({});
        }
      }
    });
  });
}

/**
 * Writes the given data to a JSON file at the specified filename.
 * The data is written in a formatted JSON structure.
 *
 * @param {string} filename - The name of the file to which the data will be written.
 * @param {Object} data - The data to be written to the file.
 * @returns {void} The function does not return a value. Any errors during the write process
 *                 will be handled internally, but not returned or thrown.
 */
function writeJsonFile(filename, data) {
  const filePath = path.join(__dirname, "../data", filename);
  fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8", (err) => {
    if (err) {
      return err;
    } else {
      return "Données écrites avec succès dans le fichier";
    }
  });
}

module.exports = { readJsonFile, writeJsonFile };
