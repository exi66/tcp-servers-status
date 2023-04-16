const path = require('path');
const config = require('../config.js');
const generateImage = require('./image.js');

const now = new Date();

const previous = new Date(now);
previous.setDate(now.getDate() - 1);
const prevDayJsonPath = path.join(config.CHARTS_DATA_PATH, previous.getFullYear().toString(), (previous.getMonth() + 1).toString(), `${previous.getDate()}.json`);
const prevDayImgPath = path.join(config.IMAGES_PATH, previous.getFullYear().toString(), (previous.getMonth() + 1).toString(), `${previous.getDate()}.png`);
generateImage(prevDayJsonPath, prevDayImgPath, true);

const monthJsonPath = path.join(config.CHARTS_DATA_PATH, now.getFullYear().toString(), (now.getMonth() + 1).toString(), `index.json`);
const monthImgPath = path.join(config.IMAGES_PATH, now.getFullYear().toString(), (now.getMonth() + 1).toString(), `index.png`);
generateImage(monthJsonPath, monthImgPath, false);