<script setup>
import Day from '@/js/DayChart.js'
import Month from '@/js/MonthChart.js'
import Config from '@/js/Config.js'
import axios from 'axios'
</script>
<script>
export default {
  data() {
    return {
      /**
       * For change app tabs;
       */
      currentSection: 'home',
      /**
       * Contains data for working on the home tab;
       */
      API: {
        status: {
          time: new Date(),
          servers: [],
        },
        timer: null,
        chartData: [],
        active: Config.SERVERS[0].name,
      },
       /**
       * Contains data for working on the day tab;
       */
      DAY: {
        date: this.html5Date(),
        chartData: [],
        active: Config.SERVERS[0].name,
      },
       /**
       * Contains data for working on the month tab;
       */
      MONTH: {
        date: this.html5Month(),
        chartData: [],
        active: Config.SERVERS[0].name,
      },
      error: null,
    }
  },
  mounted() {
    Day.create('chart');
    this.API.timer = this.startAPI();

    Day.create('dayChart');
    Month.create('monthChart');
    const self = this;
    Month.callback = function (date) {
      self.goToDay(date);
    };
  },
  methods: {
    goToDay(date) {
      this.DAY.date = this.html5Date(date);
      this.daySection();
    },
    goToMonth(date) {
      this.MONTH.date = this.html5Month(date);
      this.monthSection();
    },
    getDayImage(date) {
      const now = new Date();
      return `/images/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}.png?${now.getTime()}`;
    },
    getMonthImage(date) {
      const now = new Date();
      return `/images/${date.getFullYear()}/${date.getMonth() + 1}/index.png?${now.getTime()}`;
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
    getPing(serverName) {
      let find = this.API.status.servers.find(e => e.name === serverName);
      if (find) {
        return {
          value: find.ping,
          text: find.ping.toFixed(2) + 'ms'
        }
      }
      return {
        value: null,
        text: 'нет данных'
      }
    },
    switchData(chart, data, active) {
      let find = data.find(e => e.name === active);
      if (find) Day.update(chart, find.label, find.data);
    },
    async daySection() {
      this.currentSection = 'day';
      const localDate = new Date(this.DAY.date);
      try {
        let chartData = await this.getChartData(localDate);
        if (this.DAY.chartData !== chartData) {
          this.DAY.chartData = chartData;
          let find = chartData.find(e => e.name === this.DAY.active);
          if (find) Day.update('dayChart', find.label, find.data);
        }
      } catch (e) {
        this.error = `Не удалось получить статистику за ${localDate.toLocaleDateString()}`;
      }
    },
    async monthSection() {
      this.currentSection = 'month';
      const localDate = new Date(this.MONTH.date);
      try {
        let chartData = await this.getChartData(localDate, false);
        if (this.MONTH.chartData !== chartData) {
          this.MONTH.chartData = chartData;
          let find = chartData.find(e => e.name === this.MONTH.active);
          if (find) Month.update('monthChart', find.label, find.data);
        }
      } catch (e) {
        let d = this.html5Month(localDate).split('-');
        this.error = `Не удалось получить статистику за ${d[1]}.${d[0]}`;
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
    },
    html5Month(date) {
      let __date = this.dateInMoscow(date);
      return `${__date.getFullYear()}-${("0" + (__date.getMonth() + 1)).slice(-2)}`;
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
      <h1 class="my-auto font-bold text-lg  text-white me-3 hidden md:block">{{ Config.APP }}</h1>
      <button class="my-auto px-3 py-1 focus-visible:outline-none" :class="currentSection === 'home' ? 'text-white' : ''"
        @click="currentSection = 'home'">Главная</button>
      <button class="my-auto px-3 py-1 focus-visible:outline-none" :class="currentSection === 'day' ? 'text-white' : ''"
        @click="daySection()">День</button>
      <button class="my-auto px-2 py-1 focus-visible:outline-none" :class="currentSection === 'month' ? 'text-white' : ''"
        @click="monthSection()">Месяц</button>
    </div>
  </header>
  <main class="container mx-auto px-2">
    <section id="home" class="flex flex-col md:flex-row flex-wrap" :class="currentSection !== 'home' ? 'hidden' : ''">
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
    <section id="day" class="flex flex-col flex-wrap" :class="currentSection !== 'day' ? 'hidden' : ''">
      <div class="flex-1 flex flex-row flex-wrap p-6 justify-between">
        <div class="flex mb-2">
          <input type="date" class="border bg-transparent rounded border-gray-500 p-1  focus-visible:outline-none"
            :max="html5Date()" v-model="DAY.date" @change="daySection()">
          <a class="border bg-transparent rounded border-gray-500 ms-2 px-2 py-1 flex hover:bg-white hover:border-white hover:text-black focus-visible:outline-none"
            :href="getDayImage(new Date(DAY.date))">
            <i class="bi bi-image m-auto"></i>
          </a>
          <button
            class="border bg-transparent rounded border-gray-500 mx-2 px-2 py-1 flex hover:bg-white hover:border-white hover:text-black focus-visible:outline-none"
            @click="goToMonth(DAY.date)">
            <span class="m-auto">Этот месяц</span>
          </button>
        </div>
        <div class="flex mb-2">
          <select class="bg-dark border rounded border-gray-500 p-1 focus-visible:outline-none" v-model="DAY.active"
            @change="switchData('dayChart', DAY.chartData, DAY.active)">
            <option v-for="server in Config.SERVERS" :key="server" :value="server.name"
              :selected="DAY.active === server.name">{{ server.label }}</option>
          </select>
        </div>
      </div>
      <div class="flex-1 p-6 pt-0 flex flex-col">
        <div class="relative w-full h-full">
          <canvas id="dayChart"></canvas>
        </div>
      </div>
    </section>
    <section id="month" class="flex flex-col flex-wrap" :class="currentSection !== 'month' ? 'hidden' : ''">
      <div class="flex-1 flex flex-row flex-wrap p-6 justify-between">
        <div class="flex mb-2">
          <input type="month" class="border bg-transparent rounded border-gray-500 p-1 focus-visible:outline-none"
            :max="html5Month()" v-model="MONTH.date" @change="monthSection()">
          <a class="border bg-transparent rounded border-gray-500 mx-2 px-2 py-1 flex hover:bg-white hover:border-white hover:text-black focus-visible:outline-none"
            :href="getMonthImage(new Date(MONTH.date))">
            <i class="bi bi-image m-auto"></i>
          </a>
        </div>
        <div class="flex mb-2">
          <select class="ms-auto bg-dark border rounded border-gray-500 p-1 focus-visible:outline-none"
            v-model="MONTH.active" @change="switchData('dayChart', MONTH.chartData, MONTH.active)">
            <option v-for="server in Config.SERVERS" :key="server" :value="server.name"
              :selected="MONTH.active === server.name">{{ server.label }}</option>
          </select>
        </div>
      </div>
      <div class="flex-1 px-6 pb-6 flex flex-col">
        <div class="relative w-full h-full">
          <canvas id="monthChart"></canvas>
        </div>
      </div>
    </section>
    <transition name="fade" mode="out-in">
      <div v-if="error" :key="error" class="fixed m-4 bottom-0 right-0 bg-red-600 rounded-md alert cursor-pointer"
        @click="error = null" title="Закрыть">
        <div class="p-4 flex flex-row">
          <i class="bi bi-exclamation-triangle my-auto me-4 text-4xl"></i>
          <p class="flex-1 my-auto">{{ error }}</p>
        </div>
      </div>
    </transition>
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

  .alert {
    max-width: 20rem;
  }
}
</style>
