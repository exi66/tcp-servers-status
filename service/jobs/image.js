const fs = require('fs-extra');
const path = require('path');
const mergeImages = require('merge-images');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { Canvas, Image, createCanvas } = require('canvas');
const config = require('../config.js');

module.exports = render;

/**
 * Charts images settings;
 */
const width = 640;
const height = 300;
const title_height = 50;
const margin = 0;
const backgroundColour = '#212529';

const chartJSNodeCanvas = new ChartJSNodeCanvas({
  width, height, backgroundColour, plugins: {
    globalVariableLegacy: ['chartjs-adapter-moment']
  }, chartCallback: (ChartJS) => {
    ChartJS.defaults.font.family = 'Arial';
    ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.3)';
    ChartJS.defaults.color = 'rgba(255, 255, 255, 0.7)';
    ChartJS.defaults.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  }
});
chartJSNodeCanvas.registerFont(path.join(__dirname, '..', 'storage', 'arial.ttf'), { family: 'Arial' });

async function render(__path, __image_path, day = true) {
  if (!fs.existsSync(__path))
    return console.log(`File ${__path} not exists. Try another.`);

  const file = fs.readFileSync(__path);
  const json = JSON.parse(file).filter(e => e); //prevent any error with empty data;
  const chartData = [];

  for (let server of config.SERVERS) {
    const data = json.map(function (e) {
      let elem = {
        x: new Date(e.time),
        y: e.servers.find(s => s.name === server.name) || null
      }
      if (elem.y) elem.y = elem.y.ping < 0 ? -10 : elem.y.ping;
      return elem;
    });
    chartData.push({
      data: data,
      label: server.label
    })
  }

  const start_date = new Date(json[0].time).toLocaleDateString('ru-RU');
  const end_date = new Date(json[json.length - 1].time).toLocaleDateString('ru-RU');

  const canvas = createCanvas(width * 3 + margin * 2, title_height);
  const context = canvas.getContext('2d');
  context.fillStyle = backgroundColour;
  context.fillRect(0, 0, width * 3 + margin * 2, title_height);
  context.font = `24pt 'Arial'`;
  context.textAlign = 'center';
  context.fillStyle = 'rgba(255, 255, 255, 0.8)';
  context.fillText(`Статистика за ${start_date} - ${end_date}`, (width * 3 + margin * 2) / 2, 40);
  const title_buffer = canvas.toBuffer('image/png');

  const images = [];
  images.push({ src: title_buffer, x: 0, y: 0 });
  for (let i = 0, y_offset = 0 + title_height, x_offset = 0; i < chartData.length; i++) {
    if (i % 2 == 0 && i !== 0) x_offset += width + margin;
    if (i % 2 == 1) y_offset = height + margin + title_height;
    else y_offset = 0 + title_height;
    const configuration = day ? day_config(chartData[i].data, chartData[i].label) : month_config(chartData[i].data, chartData[i].label);
    const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
    const base64 = buffer.toString('base64');
    const image = { src: 'data:image/png;base64,' + base64, x: x_offset, y: y_offset }
    images.push(image);
  }
  mergeImages(images, {
    Canvas: Canvas,
    Image: Image,
    width: width * 3 + margin * 2,
    height: height * 2 + margin + 50
  }).then(b64 => {
    const buffer = Buffer.from(b64.replace('data:image/png;base64,', ''), 'base64');
    fs.ensureFileSync(__image_path);
    fs.writeFileSync(__image_path, buffer);
    console.log(`${__image_path} updated from ${__path} file`);
  });
};

const day_config = (chartData, label) => {
  return {
    type: 'line',
    data: {
      datasets: [{
        spanGaps: false,
        label: label,
        data: chartData,
        fill: {
          target: 'origin',
          below: 'rgba(220, 38, 38, 1)',
          above: 'rgba(22, 163, 74, 1)'
        },
        borderWidth: 0,
        backgroundColor: 'rgba(22, 163, 74, 1)',
      }],
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 20,
        }
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 0
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      scales: {
        y: {
          stacked: true,
          min: -10,
          suggestedMax: 100,
          title: {
            display: true,
            text: 'Задержка, ms'
          },
          ticks: {
            callback: function (value) {
              return value >= 0 ? value : 'down';
            }
          },
          border: {
            display: false,
          },
          grid: {
            drawBorder : false,
          }
        },
        x: {
          stacked: true,
          type: 'time',
          time: {
            displayFormats: { hour: 'HH:mm' },
            tooltipFormat: 'dd/MM/yyyy HH:mm',
            unit: 'hour',
            round: 'minute'
          },
          border: {
            display: false,
          },
          grid: {
            drawBorder : false,
          }
        }
      }
    }
  }
}

const month_config = (chartData, label) => {
  return {
    type: 'bar',
    data: {
      datasets: [{
        label: label,
        data: chartData,
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          return value.y < 0 ? 'rgba(220, 38, 38, 1)' : 'rgba(22, 163, 74, 1)';
        },
      }],
    },
    options: {
      layout: {
        padding: {
          left: 20,
          right: 20,
        }
      },
      elements: {
        point: {
          radius: 0
        }
      },
      plugins: {
        legend: {
          labels: {
            boxWidth: 0
          }
        }
      },
      scales: {
        y: {
          min: -10,
          suggestedMax: 100,
          title: {
            display: true,
            text: 'Задержка, ms'
          },
          ticks: {
            callback: function (value, ) {
              return value >= 0 ? value : 'down';
            }
          },
          border: {
            display: false,
          },
          grid: {
            drawBorder : false,
          }
        },
        x: {
          type: 'time',
          time: {
            displayFormats: { hour: 'HH:mm' },
            tooltipFormat: 'dd/MM/yyyy',
            unit: 'day',
            round: 'day'
          },
          border: {
            display: false,
          },
          grid: {
            drawBorder : false,
          }
        }
      }
    }
  }
}
