<script setup>
import Config from '@/js/Config.js'
import DayChart from '@/components/DayChart.vue'
import axios from 'axios'
</script>
<script>
export default {
  data() {
    return {
      time: new Date(),
      servers: JSON.parse(JSON.stringify(Config.SERVERS)),
      active: Config.SERVERS[0].name,
      interval: null,
    }
  },
  created() {
    this.interval = setInterval(this.callAPI, 1000 * 60);
  },
  mounted() {
    this.callAPI();
  },
  unmounted() {
    clearInterval(this.interval);
  },
  methods: {
    getDayImage(date) {
      const now = new Date();
      return `/images/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.png?${now.getTime()}`;
    },
    async getChartData(date, day = true) {
      const now = new Date();
      let res = await axios.get(`/charts/${date.getFullYear()}/${date.getMonth() + 1}/${day ? date.getDate() : 'index'}.json?${now.getTime()}`);
      if (res.status === 200 && res.data) return res.data;
      return null;
    },
    async callAPI() {
      try {
        const now = this.dateInMoscow();
        let res = await axios.get('/charts/current.json?' + now.getTime());
        if (res.status === 200 && res.data.time && res.data.servers) {
          this.time = new Date(res.data.time);
          for (let s of this.servers) {
            let find = res.data.servers.find(e => e.name === s.name) || { ping: null };
            s.ping = find.ping;
            s.textPing = find.ping ? find.ping.toFixed(2) + 'ms' : 'ожидание';
          }
        }
        let chartData = await this.getChartData(now);
        for (let server of this.servers) {
          let localChartData = chartData.map(function (e) {
            let elem = {};
            elem.x = e.time;
            let find = e.servers.find(e => e.name === server.name);
            elem.y = find ? find.ping === -1 ? -10 : find.ping : null;
            return elem;
          });
          if (server.chartData !== localChartData) server.chartData = localChartData;
        }
      } catch (e) {
        console.error(e);
      }
    },
    /**
     * Get date on backend. Use your timezone
     */
    dateInMoscow(date) {
      let __date = date ? new Date(date) : new Date();
      return new Date(
        __date.toLocaleString('en-US', { timeZone: 'Europe/Moscow' })
      );
    }
  }
}
</script>

<template>
  <header class="container mt-2 px-2 mx-auto">
    <div class="border-b border-gray-500 w-full my-1 p-1 flex flex-row">
      <img src="/favicon.png" :width="24" :height="24" alt="Logo" class="me-2 my-auto">
      <h1 class="my-auto font-bold text-lg  text-white me-3">{{ Config.APPNAME }}</h1>
    </div>
  </header>
  <main class="container mx-auto px-2">
    <section class="flex flex-col md:flex-row flex-wrap">
      <div class="h-fit flex-auto p-4 status flex flex-row md:flex-col flex-wrap justify-center">
        <fieldset class="w-full h-fit m-2 border border-gray-500 rounded p-2" v-for="group in Config.GROUPS" v-bind:key="group">
          <ul v-for="server in servers.filter(e => e.group === group.name)" v-bind:key="server">
            <li class="inline-block">
              {{ server.label }}:
              <transition name="fade" mode="out-in">
                <small :key="server.ping" class="px-1.5 rounded-md text-white"
                  :class="server.ping === null ? 'bg-gray-500' : server.ping < 0 ? 'bg-red-600' : server.ping < 100 ? 'bg-green-600' : 'bg-yellow-600'">
                  {{ server.textPing }}
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
          v-model="active">
          <option v-for="server in servers" :key="server.name" :value="server.name" :selected="active === server.name">
            {{ server.label }}
          </option>
        </select>
        <DayChart v-bind:data="servers.find(e => e.name === active)"></DayChart>
      </div>
    </section>
  </main>
  <footer class="container mx-auto px-2 mb-2">
    <div class="border-t border-gray-500 w-full my-1 p-1 flex flex-row">
      <a href="https://github.com/exi66/tcp-servers-status" class="hover:underline"><i
          class="bi bi-github me-2 text-xl"></i><small class="my-auto">by exi66</small></a>
      <small class="ms-auto my-auto" title="Время последней проверки">{{ time.toLocaleString() }}</small>
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
