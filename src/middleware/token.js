const jwt = require('jsonwebtoken');
require('dotenv').config();
const accessTokenSecret = process.env.SECRET

exports.generateAccessToken = (_username, userId) => {
    return jwt.sign(
        {
            username: _username,
            id: userId
        },
        accessTokenSecret, { expiresIn: '4h' })
}

exports.isTokenExpired = (token) => {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    return (Date.now() >= decoded.exp * 1000)
}

exports.timeToExpire = (token) => {
    const payloadBase64 = token.split('.')[1];
    const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
    const decoded = JSON.parse(decodedJson)
    return (decoded.exp * 1000 - Date.now())
}