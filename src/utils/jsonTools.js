const fs = require('fs')

exports.addToFile = (json, filePath) => {
    const jsonStr = JSON.stringify(json, null, 4)
    let error;
    fs.writeFileSync(filePath, jsonStr, 'utf8', (err) => {
        error = err
    })
    return error
}

exports.readFromFile = (filePath) => {
    let rawData = fs.readFileSync(filePath);
    return JSON.parse(rawData);
}