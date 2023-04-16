const Bree = require('bree');

console.logCopy = console.log.bind(console);
console.log = function () {
  if (arguments.length) {
    let timestamp = '[' + new Date().toLocaleString('ru-RU') + '] ';
    this.logCopy(timestamp, arguments);
  }
};

const bree = new Bree({
  logger: false,
  jobs: [
    {
      name: 'ping',
      cron: '* * * * *',
    },
    {
      name: 'month',
      cron: '0 0 * * *',
    },
    {
      name: 'generate',
      cron: '5 0 * * *',
    },
    {
      name: 'today',
      cron: '0 * * * *',
    },
  ]
});

bree.on('worker created', (name) => {
  console.log('Worker created', name);
});

bree.on('worker deleted', (name) => {
  console.log('Worker deleted', name);
});

(async () => {
  await bree.start();
})();