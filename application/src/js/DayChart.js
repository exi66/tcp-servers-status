import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';

/**
 * Сonfig for chart.js days graphs is located in this file;
 */

Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.3)';
Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
Chart.defaults.strokeStyle = 'rgba(255, 255, 255, 0.3)';
Chart.defaults.font.family = 'Arial';

export default {
  create: function (id) {
    let chart = new Chart(document.getElementById(id), {
      type: 'line',
      data: {
        datasets: [{
          spanGaps: false,
          label: '',
          data: [],
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
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
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
          },
          x: {
            stacked: true,
            type: 'time',
            time: {
              unit: 'hour',
              round: 'minute',
              displayFormats: { hour: 'HH:mm' },
              tooltipFormat: 'DD.MM.yyyy, HH:mm',
            },
            border: {
              display: false,
            },
          }
        }
      }
    });
    return chart;
  },
  update(id, label, data) {
    let chart = Chart.getChart(id);
    chart.data.datasets[0].label = label;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}