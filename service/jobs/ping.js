const path = require('path');
const tcpp = require('tcp-ping');
const util = require('util');
const fs = require('fs-extra');
const tcpPing = util.promisify(tcpp.ping);
const config = require('../config.js');

(async () => {
  const now = new Date(),
    status = { time: now.getTime(), servers: [] },
    hosts = config.SERVERS;
  for (let server of hosts) {
    let data;
    try {
      if (server.proxy)
        data = await tcpPing({
          address: server.proxy,
          port: server.port,
          attempts: config.TCP_ATTEMPTS,
          timeout: config.TCP_TIMEOUT
        });
      if (!server.proxy || !data.avg)
        data = await tcpPing({
          address: server.address,
          port: server.port,
          attempts: config.TCP_ATTEMPTS,
          timeout: config.TCP_TIMEOUT
        });
    } catch (e) {
      console.log('Ping error:', e);
    }
    server.ping = data.avg || -1;
    status.servers.push({ name: server.name, ping: server.ping });
  }
  /**
   * Append data to current day data;
   */
  try {
    const savePath = path.join(
      config.CHARTS_DATA_PATH,
      now.getFullYear().toString(),
      (now.getMonth() + 1).toString(),
      `${now.getDate()}.json`
    );
    fs.ensureFileSync(savePath);
    const file = fs.readFileSync(savePath);
    const json = JSON.parse(file.length === 0 ? '[]' : file);
    json.push(status);
    fs.writeFileSync(savePath, JSON.stringify(json));
  } catch (e) {
    console.log('Cannot write data to file:', e);
  }
  /**
   * Save data as current status;
   */
  try {
    const savePath = path.join(
      config.CHARTS_DATA_PATH,
      `current.json`
    );
    fs.ensureFileSync(savePath);
    fs.writeFileSync(savePath, JSON.stringify(status));
  } catch (e) {
    console.log('Cannot write data to current file:', e);
  }
})();
