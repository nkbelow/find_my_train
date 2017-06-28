
const embarcaderoRows = document.querySelectorAll('#embarcadero-times td');
const montegomeryRows = document.querySelectorAll('#montgomery-times td');
const powellRows = document.querySelectorAll('#powell-times td');
const civicCenterRows = document.querySelectorAll('#civic-center-times td');

const populateDepartureRows = (data, station, rows) => {
  let i;
  const trains = {
    '0': 'Richmond',
    '1': 'Pittsburg/Bay Point',
    '2': 'Daly City',
    '3': 'SF Airport',
    '4': 'Millbrae'
  };
  for (i = 0; i < rows.length; i++) {
    rows[i].innerHTML = `in ${data[station][trains[i]]} minutes`;
  }
};

const populateDepartureTable = (data) => {
  populateDepartureRows(data, 'Civic Center/UN Plaza', civicCenterRows);
  populateDepartureRows(data, 'Embarcadero', embarcaderoRows);
  populateDepartureRows(data, 'Montgomery St.', montegomeryRows);
  populateDepartureRows(data, 'Powell St.', powellRows);
};

const populateOptionsColumns = (options, tableClass, childNum) => {
  const tableBody = document.querySelector(`.${tableClass} tbody`);
  const tableRows = tableBody.querySelectorAll(`tr`);

  if (typeof options === 'string') {
    tableRows[0].children[childNum].innerHTML = options;
    return;
  }

  for (var i = 0; i < options.length; i++) {
    tableRows[i].children[childNum].innerHTML = options[i];
  }
};


const calculateRouteOptions = (data, northBoundTrain, southBoundTrain) => {
  const options = [];
  const embarcadero = data['Embarcadero'];
  const montgomery = data['Montgomery St.'];
  const powell = data['Powell St.'];
  const civicCenter = data['Civic Center/UN Plaza'];
  if (embarcadero[southBoundTrain] < embarcadero[northBoundTrain]) {
    if (montgomery[southBoundTrain] < montgomery[northBoundTrain] && montgomery[southBoundTrain] > embarcadero[southBoundTrain]) {
      options.push(`Take ${southBoundTrain} to Montgomery St. Station. From there you will have approximately ${montgomery[northBoundTrain] - montgomery[southBoundTrain]}
       minutes to catch the ${northBoundTrain}`);
      if (powell[southBoundTrain] < powell[northBoundTrain] && powell[southBoundTrain] > embarcadero[southBoundTrain]) {
        options.push(`Take ${southBoundTrain} to Powell St. Station. You have approximately ${powell[northBoundTrain] - powell[southBoundTrain]} minutes
          to catch the ${northBoundTrain} Train`);
        if (civicCenter[southBoundTrain] < civicCenter[northBoundTrain] && civicCenter[southBoundTrain] > powell[southBoundTrain]) {
          options.push(`Take ${southBoundTrain} to Civic Center/UN Plaza Station. You have approximately ${civicCenter[northBoundTrain] - civicCenter[southBoundTrain]}
            minutes to catch the ${northBoundTrain} Train`);
        }
      }
    }
  }
  return options.length !== 0 ? options : `You will miss your train if you take the ${southBoundTrain} train. Please check back in 1 min to view updated routes`;
};

const getBartData = () => {
  fetch('/trains')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      populateDepartureTable(data);
      populateOptionsColumns(calculateRouteOptions(data, 'Richmond', 'Daly City'), 'richmond-options', 0);
      populateOptionsColumns(calculateRouteOptions(data, 'Richmond', 'SF Airport'), 'richmond-options', 1);
      populateOptionsColumns(calculateRouteOptions(data, 'Richmond', 'Millbrae'), 'richmond-options', 2);
      populateOptionsColumns(calculateRouteOptions(data, 'Pittsburg/Bay Point', 'Daly City'), 'pittsburg_baypoint-options', 0);
      populateOptionsColumns(calculateRouteOptions(data, 'Pittsburg/Bay Point', 'SF Airport'), 'pittsburg_baypoint-options', 1);
      populateOptionsColumns(calculateRouteOptions(data, 'Pittsburg/Bay Point', 'Millbrae'), 'pittsburg_baypoint-options', 2);

    });
};



getBartData();