const generalEmbeds = require('./general');
const pauseEmbeds = require('./pause');
const resumeEmbeds = require('./resume');
const playEmbeds = require('./play')

module.exports = {
    ...generalEmbeds,
    ...pauseEmbeds,
    ...resumeEmbeds,
    ...playEmbeds,
};