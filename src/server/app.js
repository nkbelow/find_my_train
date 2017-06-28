const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 3000;

const departureTrains = ['Richmond', 'Pittsburg/Bay Point', 'Daly City', 'SF Airport', 'Millbrae'];


const departures = {
  'Embarcadero': {
    'Richmond': null,
    'Pittsburg/Bay Point': null,
    'Daly City': null,
    'SF Airport': null,
    'Millbrae': null
  },
  'Montgomery St.': {
    'Richmond': null,
    'Pittsburg/Bay Point': null,
    'Daly City': null,
    'SF Airport': null,
    'Millbrae': null
  },
  'Powell St.': {
    'Richmond': null,
    'Pittsburg/Bay Point': null,
    'Daly City': null,
    'SF Airport': null,
    'Millbrae': null
  },
  'Civic Center/UN Plaza': {
    'Richmond': null,
    'Pittsburg/Bay Point': null,
    'Daly City': null,
    'SF Airport': null,
    'Millbrae': null
  }
};

const nextDestinationDeparture = (data, destinations, departures) => {
  let station = data['root']['station'][0]['name'];
  console.log(station)
  let trains = data['root']['station'][0]['etd'];
  if (!trains) {
    return `${data['root']['station']} trains are now closed`;
  }
  let i;
  for (i = 0; i < trains.length; i++) {
    let train = trains[i];
    if (destinations.includes(train.destination)) {
      departures[station][train.destination] = train['estimate'][0].minutes !== 'Leaving' ? +train['estimate'][0].minutes : 0;
    }
  }     
};

const getBartData = (req, res) => {
  const embr = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=embr&key=MW9S-E7SL-26DU-VV8V&json=y';
  const mont = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=mont&key=MW9S-E7SL-26DU-VV8V&json=y';
  const powell = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=powl&key=MW9S-E7SL-26DU-VV8V&json=y';
  const civic = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=civc&key=MW9S-E7SL-26DU-VV8V&json=y';
  fetch(embr)
    .then(res => res.json())
    .then(data => {
      nextDestinationDeparture(data, departureTrains, departures);
      return fetch(mont);
    })
    .then(res => res.json())
    .then(data => {
      nextDestinationDeparture(data, departureTrains, departures);
      return fetch(powell)
    })
    .then(res => res.json())
    .then(data => {
      return fetch(civic);
    })
    .then(res => res.json())
    .then(data => {
      nextDestinationDeparture(data, departureTrains, departures);
      res.json(departures);
    })
    .catch(err => console.log(err));
};


var task = cron.schedule('*/1 * * * *', function() {
  const embr = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=embr&key=MW9S-E7SL-26DU-VV8V&json=y';
  const mont = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=mont&key=MW9S-E7SL-26DU-VV8V&json=y';
  const powell = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=powl&key=MW9S-E7SL-26DU-VV8V&json=y';
  const civic = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=civc&key=MW9S-E7SL-26DU-VV8V&json=y';
  fetch(embr)
    .then(res => res.json())
    .then(data => {
      fs.writeFile(__dirname + '/../../trainSchedules/embr.txt', JSON.stringify(data, null, 4), function() {
        console.log('Embarcadero')
      })
      nextDestinationDeparture(data, departureTrains, departures)
    })
    .catch(err => console.log(err));
  fetch(mont)
    .then(res => res.json())
    .then(data => {
      fs.writeFile(__dirname + '/../../trainSchedules/mont.txt', JSON.stringify(data, null, 4), function() {
        console.log('data was received');
      })
      nextDestinationDeparture(data, departureTrains, departures)
    })
    .catch(err => console.log(err));
  fetch(powell)
    .then(res => res.json())
    .then(data => {
      fs.writeFile(__dirname + '/../../trainSchedules/powell.txt', JSON.stringify(data, null, 4), function() {
        nextDestinationDeparture(data, departureTrains, departures)
        console.log('data was received');
      });
    })
    .catch(err => console.log(err));
  fetch(civic)
    .then(res => res.json())
    .then(data => {
      fs.writeFile(__dirname + '/../../trainSchedules/civic.txt', JSON.stringify(data, null, 4), function() {
        console.log('data was received');
      });
      nextDestinationDeparture(data, departureTrains, departures);
    })
    .catch(err => console.log(err));
  console.log('running a task every minute', new Date());
  console.log(departures['Embarcadero'], 'this is Embarcadero');
}, true);

task.start();

app.use('/', express.static(path.join(__dirname, '../../public')));

app.get('/trains', getBartData);



app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});



