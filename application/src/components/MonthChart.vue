<template>
  <div>
    <BarChart :data="chartData" :options="options" style="position: relative; width: 100%; max-height: 256px;" />
  </div>
</template>

<script>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  TimeScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import { Bar as BarChart } from 'vue-chartjs'
import 'chartjs-adapter-moment'

ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.3)'
ChartJS.defaults.color = 'rgba(255, 255, 255, 0.7)'
ChartJS.defaults.strokeStyle = 'rgba(255, 255, 255, 0.3)'
ChartJS.defaults.font.family = 'Arial'
ChartJS.register(Title, Tooltip, Legend, TimeScale, BarElement, CategoryScale, LinearScale)

export default {
  components: {
    BarChart
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
          label: this.data.label,
          data: this.data.data,
          borderWidth: 0,
          backgroundColor: function (context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            if (value) return value.y < 0 ? 'rgba(220, 38, 38, 1)' : 'rgba(22, 163, 74, 1)';
            else return 'rgba(22, 163, 74, 1)';
          },
        }],
      }
    }
  },
  data() {
    return {
      options: {
        onClick: (event, chartItem) => {
          console.log(chartItem);
        },
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
    }
  }
}
</script>