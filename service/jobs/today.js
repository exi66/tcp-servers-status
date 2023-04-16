const path = require('path');
const config = require('../config.js');
const generateImage = require('./image.js');

const now = new Date();
const dayJsonPath = path.join(config.CHARTS_DATA_PATH, now.getFullYear().toString(), (now.getMonth() + 1).toString(), `${now.getDate()}.json`);
const dayImgPath = path.join(config.IMAGES_PATH, now.getFullYear().toString(), (now.getMonth() + 1).toString(), `${now.getDate()}.png`);
generateImage(dayJsonPath, dayImgPath);