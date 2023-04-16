const path = require('path');
const fs = require('fs-extra');
const config = require('../config.js');

const directory = config.CHARTS_DATA_PATH;
const hosts = config.SERVERS;
const threshold = 10;

fs.readdirSync(directory).filter(file => file !== '.gitignore' && file != 'current.json').forEach(year => {
  const months = fs.readdirSync(path.join(directory, year));
  for (let month of months) {
    run(path.join(directory, year, month));
  }
});

function run(__path) {
  const directory = __path;
  const files = fs.readdirSync(directory).filter(file => file.endsWith('.json') && file !== 'index.json');
  const month = [];

  for (let file of files) {
    const pull = JSON.parse(fs.readFileSync(path.join(directory, file))).filter(e => e);
    const dayNumber = parseInt(file.replace('.json', ''));

    if (pull.length < 1) continue

    const localDate = new Date(pull[0].time);
    localDate.setHours(0, 0, 0, 1);
    localDate.setDate(dayNumber);
    const avgLatency = { time: localDate.getTime(), servers: [] };

    for (let h of hosts) {
      let s = null;
      let downCount = 0;
      for (let p of pull) {
        let server = p.servers.find(e => e.name === h.name);
        if (!server) continue;
        if (server.ping > 0) s += server.ping;
        else downCount++;
      }
      if (downCount > threshold) avgLatency.servers.push({ name: h.name, ping: -1 });
      else {
        let localAvg = s !== null ? s / (pull.length - downCount) : null;
        avgLatency.servers.push({ name: h.name, ping: localAvg });
      }
    }
    month.push(avgLatency);
  }
  const savePath = path.join(directory, 'index.json');
  fs.ensureFileSync(savePath);
  fs.writeFileSync(savePath, JSON.stringify(month));
  console.log(`file ${savePath} saved`);
}


