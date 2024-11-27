const fs = require("node:fs");
const path = require("node:path");

function getAllFiles(dirPath, ext, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), ext, arrayOfFiles);
        } else if (file.endsWith(ext)) {
            arrayOfFiles.push(path.join(dirPath, file));
        }
    });

    return arrayOfFiles;
}

module.exports = { getAllFiles };