module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [

    // Main API Hosting
    // {
    //   name: 'API',
    //   script: 'bin/www',
    //   env: {
    //     COMMON_VARIABLE: 'true'
    //   },
    //   instances: 1,
    //   exec_mode: 'cluster',
    //   watch: false,
    //   autorestart: true
    // },
    {
      name: 'ping',
      script: 'jobs/ping.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '* * * * *',
      watch: false,
      autorestart: false
    },
    {
      name: 'month',
      script: 'jobs/month.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 0 * * *',
      watch: false,
      autorestart: false
    },
    {
      name: 'generate',
      script: 'jobs/generate.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '5 0 * * *',
      watch: false,
      autorestart: false
    },
    {
      name: 'today',
      script: 'jobs/today.js',
      instances: 1,
      exec_mode: 'fork',
      cron_restart: '0 * * * *',
      watch: false,
      autorestart: false
    }
  ]
};