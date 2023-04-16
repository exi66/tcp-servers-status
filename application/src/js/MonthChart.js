import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

/**
 * Сonfig for chart.js monts graphs is located in this file;
 */

Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.3)';
Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.strokeStyle = 'rgba(255, 255, 255, 0.3)';
Chart.defaults.font.family = 'Arial';

export default {
  callback: function () { },
  create: function (id) {
    let chart = new Chart(document.getElementById(id), {
      type: 'bar',
      data: {
        datasets: [{
          label: '',
          data: [],
          borderWidth: 0,
          backgroundColor: function (context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            if (value) return value.y < 0 ? 'rgba(220, 38, 38, 1)' : 'rgba(22, 163, 74, 1)';
            else return 'rgba(22, 163, 74, 1)';
          },
        }],
      },
      options: {
        onHover: (event, chartItem) => {
          if (chartItem.length > 0) {
            event.native.target.style.cursor = 'pointer';
          } else {
            event.native.target.style.cursor = 'default';
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
              callback: function (value) {
                return value >= 0 ? value : 'down';
              }
            },
            border: {
              display: false,
            }
          },
          x: {
            type: 'time',
            time: {
              displayFormats: { hour: 'HH:mm' },
              tooltipFormat: 'DD.MM.yyyy',
              unit: 'day',
              round: 'day'
            },
            border: {
              display: false,
            }
          }
        }
      }
    });
    const self = this;
    chart.canvas.onclick = function (evt) {
      var points = chart.getElementsAtEventForMode(evt, 'nearest', { intersect: true }, true);
      if (points[0]) {
        const dataset = points[0].datasetIndex;
        const index = points[0].index;
        const value = chart.data.datasets[dataset].data[index];
        self.callback(value.x);
      }
    };
    return chart;
  },
  update(id, label, data) {
    let chart = Chart.getChart(id);
    chart.data.datasets[0].label = label;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}