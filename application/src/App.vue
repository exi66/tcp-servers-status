<script setup>
import Day from '@/js/DayChart.js'
import Config from '@/js/Config.js'
import axios from 'axios'
</script>
<script>
export default {
  data() {
    return {
      API: {
        status: {
          time: new Date(),
          servers: [],
        },
        timer: null,
        chartData: [],
        active: Config.SERVERS[0].name,
      },
    }
  },
  mounted() {
    Day.create('chart');
    this.API.timer = this.startAPI();
  },
  unmounted() {
    Day.destroy('chart');
    clearInterval(this.API.timer);
  },
  methods: {
    getPing(server) {
      let find = this.API.status.servers.find(e => e.name === server);
      if (find) return {
        value: find.ping,
        text: find.ping.toFixed(2) + 'ms'
      };
      else return {
        value: null,
        text: 'ожидание'
      };
    },
    getDayImage(date) {
      const now = new Date();
      return `/images/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.png?${now.getTime()}`;
    },
    async getChartData(date, day = true) {
      const now = new Date();
      let res = await axios.get(`/charts/${date.getFullYear()}/${date.getMonth() + 1}/${day ? date.getDate() : 'index'}.json?${now.getTime()}`);
      let chartData = [];
      if (res.status === 200 && res.data) {
        for (let server of Config.SERVERS) {
          chartData.push({
            name: server.name,
            label: server.label,
            data: res.data.map(function (e) {
              let elem = {};
              elem.x = e.time;
              let find = e.servers.find(e => e.name === server.name);
              elem.y = find ? find.ping == -1 ? -10 : find.ping : null;
              return elem;
            })
          });
        }
      }
      return chartData;
    },
    async startAPI() {
      try {
        const now = this.dateInMoscow();
        let res = await axios.get('/charts/current.json?' + now.getTime());
        if (res.status === 200 && res.data.time && res.data.servers) {
          this.API.status.time = new Date(res.data.time);
          this.API.status.servers = res.data.servers;
        }
        let chartData = await this.getChartData(now);
        if (this.API.chartData !== chartData) {
          this.API.chartData = chartData;
          let find = chartData.find(e => e.name === this.API.active);
          if (find) Day.update('chart', find.label, find.data);
        }
      } catch (e) {
        console.error(e);
      }
      return setInterval(this.startAPI, 1000 * 60);
    },
    switchData(chart, data, active) {
      let find = data.find(e => e.name === active);
      if (find) Day.update(chart, find.label, find.data);
    },
    /**
     * Get date on backend. Use your timezone
     */
    dateInMoscow(date) {
      let __date = date ? new Date(date) : new Date();
      return new Date(
        __date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' })
      );
    },
    html5Date(date) {
      let __date = this.dateInMoscow(date);
      return `${__date.getFullYear()}-${("0" + (__date.getMonth() + 1)).slice(-2)}-${("0" + __date.getDate()).slice(-2)}`;
    }
  }
}
</script>

<template>
  <header class="container mt-2 px-2 mx-auto">
    <div class="border-b border-gray-500 w-full my-1 p-1 flex flex-row">
      <img src="/favicon.png" :width="24" :height="24" alt="Logo" class="me-2 my-auto">
      <h1 class="my-auto font-bold text-lg  text-white me-3">{{ Config.APP }}</h1>
    </div>
  </header>
  <main class="container mx-auto px-2">
    <section class="flex flex-col md:flex-row flex-wrap">
      <div class="h-fit flex-auto p-4 status flex flex-row md:flex-col flex-wrap justify-center">
        <fieldset class="w-full h-fit m-2 border border-gray-500 rounded p-2" v-for="group in Config.GROUPS"
          v-bind:key="group">
          <ul v-for="server in Config.SERVERS.filter(e => e.group === group.name)" v-bind:key="server">
            <li class="inline-block">
              {{ server.label }}:
              <transition name="fade" mode="out-in">
                <small :key="getPing(server.name).value" class="px-1.5 rounded-md text-white"
                  :class="getPing(server.name).value === null ? 'bg-gray-500' : getPing(server.name).value < 0 ? 'bg-red-600' : getPing(server.name).value < 100 ? 'bg-green-600' : 'bg-yellow-600'">
                  {{ getPing(server.name).text }}
                </small>
              </transition>
            </li>
          </ul>
          <legend class="mx-auto px-2">
            <h2 class="text-xl text-white">{{ group.label }}</h2>
          </legend>
        </fieldset>
      </div>
      <div class="flex-1 p-6 flex flex-col">
        <select class="ms-auto bg-dark border rounded border-gray-500 px-1 py-1 focus-visible:outline-none"
          v-model="API.active" @change="switchData('chart', API.chartData, API.active)">
          <option v-for="server in Config.SERVERS" :key="server" :value="server.name"
            :selected="API.active === server.name">{{ server.label }}</option>
        </select>
        <div class="relative w-full h-full">
          <canvas id="chart" height="150px"></canvas>
        </div>
      </div>
    </section>
  </main>
  <footer class="container mx-auto px-2 mb-2">
    <div class="border-t border-gray-500 w-full my-1 p-1 flex flex-row">
      <a href="https://github.com/exi66/tcp-servers-status" class="hover:underline"><i
          class="bi bi-github me-2 text-xl"></i><small class="my-auto">by exi66</small></a>
      <small class="ms-auto my-auto" title="Время последней проверки">{{ API.status.time.toLocaleString() }}</small>
    </div>
  </footer>
</template>

<style scoped>
select,
button,
a,
input {
  color-scheme: dark;
  cursor: pointer;
}

select:focus {
  outline: 0;
}

.fade-enter-active {
  transition: opacity .3s ease-in-out;
}

.fade-leave-active {
  transition: opacity .3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (min-width: 768px) {
  .status {
    max-width: 30%;
  }
}
</style>
