const express = require('express');
const firebase = require('firebase');
const cron = require('node-cron');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const port = 3000;


const nextDalyCityDepartures = {
  'Embarcadero': null,
  'Montegomery': null,
  'Powell': null,
  'Civic Center': null
};

const nextRichmondDepartures = {
  'Embarcadero': null,
  'Montegomery': null,
  'Powell': null,
  'Civic Center': null
};



const nextDestinationDeparture = (data, destination) => {
  let trains = data['root']['station'][0]['etd'];
  let i;
  for (i = 0; i < trains.length; i++) {
    let train = trains[i];
    if (train.destination === destination) {
      return +train['estimate'][0].minutes;
    }
  }     
};



var task = cron.schedule('*/1 * * * *', function() {
  const embr = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=embr&key=MW9S-E7SL-26DU-VV8V&json=y';
  const mont = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=mont&key=MW9S-E7SL-26DU-VV8V&json=y';
  const powell = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=powl&key=MW9S-E7SL-26DU-VV8V&json=y';
  const civic = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=civc&key=MW9S-E7SL-26DU-VV8V&json=y';
  fetch(embr)
    .then(res => res.json())
    .then(data => {
      fs.writeFile('embr.txt', JSON.stringify(data, null, 4), function() {
        console.log('Embarcadero')
      })
      nextRichmondDepartures['Embarcadero'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Embarcadero'] = nextDestinationDeparture(data, 'Daly City');
    });
  fetch(mont)
    .then(res => res.json())
    .then(data => fs.writeFile('mont.txt', JSON.stringify(data, null, 4), function() {
      console.log('data was received');
      nextRichmondDepartures['Montegomery'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Montegomery'] = nextDestinationDeparture(data, 'Daly City');
    }));
  fetch(powell)
    .then(res => res.json())
    .then(data => fs.writeFile('powell.txt', JSON.stringify(data, null, 4), function() {
      nextRichmondDepartures['Powell'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Powell'] = nextDestinationDeparture(data, 'Daly City');
      console.log('data was received');
    }));
  fetch(civic)
    .then(res => res.json())
    .then(data => fs.writeFile('civic.txt', JSON.stringify(data, null, 4), function() {
      nextRichmondDepartures['Civic Center'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Civic Center'] = nextDestinationDeparture(data, 'Daly City');
      console.log('data was received');
    }));
  console.log('running a task every minute', new Date())
  console.log(nextRichmondDepartures, 'these are the richmond RichmondDepartures');
  console.log(nextDalyCityDepartures, 'these are the daily city departures')
}, true);


task.start();

app.get('/', (req, res) => {
  console.log('this is working');
  const embr = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=embr&key=MW9S-E7SL-26DU-VV8V&json=y';
  const mont = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=mont&key=MW9S-E7SL-26DU-VV8V&json=y';
  const powell = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=powl&key=MW9S-E7SL-26DU-VV8V&json=y';
  const civic = 'http://api.bart.gov/api/etd.aspx?cmd=etd&orig=civc&key=MW9S-E7SL-26DU-VV8V&json=y';
  fetch(embr)
    .then(res => res.json())
    .then(data => {
      fs.writeFile('embr.txt', JSON.stringify(data, null, 4), function() {
        console.log('Embarcadero')
      })
      nextRichmondDepartures['Embarcadero'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Embarcadero'] = nextDestinationDeparture(data, 'Daly City');
    });
  fetch(mont)
    .then(res => res.json())
    .then(data => fs.writeFile('mont.txt', JSON.stringify(data, null, 4), function() {
      console.log('data was received');
      nextRichmondDepartures['Montegomery'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Montegomery'] = nextDestinationDeparture(data, 'Daly City');
    }));
  fetch(powell)
    .then(res => res.json())
    .then(data => fs.writeFile('powell.txt', JSON.stringify(data, null, 4), function() {
      nextRichmondDepartures['Powell'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Powell'] = nextDestinationDeparture(data, 'Daly City');
      console.log('data was received');
    }));
  fetch(civic)
    .then(res => res.json())
    .then(data => fs.writeFile('civic.txt', JSON.stringify(data, null, 4), function() {
      nextRichmondDepartures['Civic Center'] = nextDestinationDeparture(data, 'Richmond');
      nextDalyCityDepartures['Civic Center'] = nextDestinationDeparture(data, 'Daly City');
      console.log('data was received');
    }));
  res.send('We are live');
});



app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});



