const generalEmbeds = require('./general');
const pauseEmbeds = require('./pause');
const resumeEmbeds = require('./resume');
const playEmbeds = require('./play')
const skipEmbeds = require('./skip')

module.exports = {
    ...generalEmbeds,
    ...pauseEmbeds,
    ...resumeEmbeds,
    ...playEmbeds,
    ...skipEmbeds
};