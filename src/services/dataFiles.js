const path = require("path");
const fs = require("fs");

function readJsonFile(filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, "../data", filename);

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
