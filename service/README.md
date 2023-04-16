# tcp-servers-status

Backend service application for visualizing the collected statistics. Allows using charts.js to view data in real time. 

## Project Setup

### Settings

```sh
npm install
```
To run, you need to create a `./config.js` file similar to `./config.js.example`.
Jobs run by default: 
 - ping (every minute ping servers and update current day json file)
 - month (at 0:00 generate month json file)
 - generate (at 0:05 generate month and prev day image)
 - today (every hour update current day image)

You can turn any of them off if you don't need it or change intervals in `./app.js` and `./ecosystem.config.js`. 

### Run 

```sh
npm start
```
### Run like pm2 ecosystem

```sh
p2 start ecosystem.config.js
```