// Import the combineAllFormData function from NetlogoInputV1.js
import { combineAllFormData } from './NetlogoInputV1.js';
// console.log(combineAllFormData);
function findMatchingObject(data, combinationData, category) {
  for (const key in data[category]) {
    const dataValues = data[category][key];
    let match = true;
    for (const dataKey in dataValues) {
      const dataValue = dataValues[dataKey];
      const combinationValue = parseFloat(combinationData[dataKey]);
      if (isNaN(combinationValue) || isNaN(parseFloat(dataValue))) {
        if (dataValue.toString() !== combinationData[dataKey].toString()) {
          match = false;
          break;
        }
      } else {
        if (parseFloat(dataValue) !== combinationValue) {
          match = false;
          break;
        }
      }
    }
    if (match) {
      return dataValues;
    }
  }
  return null;
}

// Get the user input data
const combinationData = combineAllFormData();

// Replace the predefined data object with the user input data
const data = {
  agriculture: combinationData.agriculture,
  energy: combinationData.energy,
  water: combinationData.irrigation,
  climate: combinationData.climate,
};

const agricultureData = findMatchingObject(data, combinationData.agriculture, 'agriculture');
const energyData = findMatchingObject(data, combinationData.energy, 'energy');
const irrigationData = findMatchingObject(data, combinationData.irrigation, 'water');
const climateData = findMatchingObject(data, combinationData.climate, 'climate');

// Render graphs using the retrieved data
renderAgriculture(agricultureData);
renderEnergy(energyData);
renderIrrigation(irrigationData);
renderClimate(climateData);


console.log('Agriculture Data:', agricultureData);
console.log('Energy Data:', energyData);
console.log('Irrigation Data:', irrigationData);
console.log('Climate Data:', climateData);
