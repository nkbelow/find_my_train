
const embarcaderoRows = document.querySelectorAll('#embarcadero-times td');
const montegomeryRows = document.querySelectorAll('#montgomery-times td');
const powellRows = document.querySelectorAll('#powell-times td');
const civicCenterRows = document.querySelectorAll('#civic-center-times td');

const populateRows = (data, station, rows) => {
  let i;
  const trains = {
    0: 'Richmond',
    '1': 'Pittsburg/Bay Point',
    '2': 'Daly City',
    '3': 'SF Airport',
    '4': 'Millbrae'
  };
  for (i = 0; i < rows.length; i++) {
    rows[i].innerHTML = `in ${data[station][trains[i]]} minutes`;
  }
};



const calculateRouteOptions = (data, northBoundTrain, southBoundTrain) => {
  const options = [];
  const embarcadero = data['Embarcadero'];
  const montgomery = data['Montgomery St.'];
  const powell = data['Powell St.'];
  const civicCenter = data['Civic Center/UN Plaza'];
  options.push(`Take ${northBoundTrain} Train from Embarcadero in ${embarcadero[northBoundTrain]} minutes to catch ${northBoundTrain} Train`);
  if (embarcadero[southBoundTrain] < embarcadero[northBoundTrain]) {
    if (montgomery[southBoundTrain] < montgomery[northBoundTrain]) {
      options.push(`Take ${southBoundTrain} to Montgomery St. Station. From there you will have approximately ${montgomery[southBoundTrain] - montgomery[northBoundTrain]}
       minutes to catch the ${northBoundTrain}`);
      if (powell[southBoundTrain] < powell[northBoundTrain]) {
        options.push(`Take ${southBoundTrain} to Powell St. Station. You have approximately ${powell[southBoundTrain] - powell[northBoundTrain]} minutes
          to catch the ${northBoundTrain} Train`);
        if (civicCenter[southBoundTrain] < civicCenter[northBoundTrain]) {
          options.push(`Take ${southBoundTrain} to Civic Center/UN Plaza Station. You have approximately ${civicCenter[southBoundTrain] - civicCenter[northBoundTrain]}
            minutes to catch the ${northBoundTrain} Train`);
        }
      }
    }
  }
  return options;
};

const getBartData = () => {
  fetch('/trains')
    .then(res => res.json())
    .then(data => {
      console.log(data);
      populateRows(data, 'Civic Center/UN Plaza', civicCenterRows);
      populateRows(data, 'Embarcadero', embarcaderoRows);
      populateRows(data, 'Montgomery St.', montegomeryRows);
      populateRows(data, 'Powell St.', powellRows);
      console.log(calculateRouteOptions(data, 'Richmond', 'Daly City'));
      console.log(calculateRouteOptions(data, 'Pittsburg/Bay Point', 'Daly City'));
    });
};



getBartData();