<template>
  <div>
    <LineChart :data="chartData" :options="options" style="position: relative; width: 100%; max-height: 256px;" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Filler,
} from 'chart.js'
import { Line as LineChart } from 'vue-chartjs'
import 'chartjs-adapter-moment'

ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.3)'
ChartJS.defaults.color = 'rgba(255, 255, 255, 0.7)'
ChartJS.defaults.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ChartJS.defaults.font.family = 'Arial'
ChartJS.register(PointElement, TimeScale, LineElement, LinearScale, Filler, Title, Tooltip, Legend)

export default {
  components: {
    LineChart
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartData() {
      return {
        datasets: [{
          spanGaps: false,
          label: this.data.label,
          data: this.data.chartData,
          fill: {
            target: 'origin',
            below: 'rgba(220, 38, 38, 1)',
            above: 'rgba(22, 163, 74, 1)'
          },
          borderWidth: 0,
          backgroundColor: 'rgba(22, 163, 74, 1)',
        }],
      }
    }
  },
  data() {
    return {
      options: {
        responsive: true,
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
    }
  }
}
</script>