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

// function findMatchingKey(data, combinationData, category) {
//     for (const key in data[category]) {
//       const dataValues = data[category][key];
//       let match = true;
//       for (const dataKey in dataValues) {
//         const dataValue = dataValues[dataKey];
//         const combinationValue = parseFloat(combinationData[dataKey]);
  
//         // Check for non-numeric values
//         if (isNaN(combinationValue) || isNaN(parseFloat(dataValue))) {
//           // If either value is not a number, compare as strings
//           if (dataValue.toString() !== combinationData[dataKey].toString()) {
//             match = false;
//             break;
//           }
//         } else {
//           // If both values are numbers, compare as floats
//           if (parseFloat(dataValue) !== combinationValue) {
//             match = false;
//             break;
//           }
//         }
//       }
//       if (match) {
//         return key;
//       }
//     }
//     return null; // Return null if no match is found
//   }
  
//   const data = {
//     agriculture: {
//       A1: { corn_area: 500, wheat_area: 125, soybeans_area: 0, sg_area: 125 },
//       A2: { corn_area: 150, wheat_area: 200, soybeans_area: 200, sg_area: 200 },
//     },
//     energy: {
//       E1: {
//         energy_value: 38,
//         loan_term: 20,
//         interest: 3,
//         num_wind_turbines: 4,
//         nyear_w: 30,
//         capacity_w: 2,
//         cost_w: 1470,
//         degrade_w: 1,
//         wind_factor: 25,
//         num_panel_sets: 10,
//         nyear_s: 25,
//         cost_s: 1750,
//         capacity_s: 250,
//         degrade_s: 1,
//         sun_hrs: 6,
//         ptc_w: 0.03,
//         itc_s: 30,
//         ptc_s: 0.03,
//       },
//       E2: {
//         energy_value: 45,
//         loan_term: 20,
//         interest: 3,
//         num_wind_turbines: 4,
//         nyear_w: 30,
//         capacity_w: 2,
//         cost_w: 1470,
//         degrade_w: 1,
//         wind_factor: 42,
//         num_panel_sets: 10,
//         nyear_s: 25,
//         cost_s: 1750,
//         capacity_s: 250,
//         degrade_s: 1,
//         sun_hrs: 6,
//         ptc_w: 0.03,
//         itc_s: 30,
//         ptc_s: 0.03,
//       },
//     },
//     water: {
//       W1: { aquifier_level: 200, min_aquifier_level: 30 },
//       W2: { aquifier_level: 300, min_aquifier_level: 30 },
//     },
//     climate: {
//       C1: { future_processes: "Repeat Historical" },
//       C2: { future_processes: "Wetter Future" },
//       C3: { future_processes: "Dryer Future" },
//       C4: { future_processes: "GCM", climate_model: "RCP4.5" },
//       C5: { future_processes: "GCM", climate_model: "RCP8.5" },
//     },
//   };
  
//   const combinationData = {
//     agriculture: {
//       corn_area: '150',
//       wheat_area: '200',
//       soybeans_area: '200',
//       sg_area: '200',
//     },
//     energy: {
//       energy_value: '45.0',
//       loan_term: '20',
//       interest: '3',
//       num_wind_turbines: '4',
//       nyear_w: '30',
//       capacity_w: '2',
//       cost_w: '1470',
//       degrade_w: '1.0',
//       wind_factor: '42',
//       num_panel_sets: '10',
//       nyear_s: '25',
//       cost_s: '1750',
//       capacity_s: '250',
//       degrade_s: '1',
//       sun_hrs: '6',
//       ptc_w: '0.03',
//       itc_s: '30',
//       ptc_s: '0.03',
//     },
//     irrigation: { aquifier_level: '200', min_aquifier_level: '30' },
//     climate: { future_processes: 'Repeat Historical' },
//   };
  
//   console.log('data:', data);
//   console.log('combinatiin:', combinationData);
//   console.log(combinationData.agriculture);
  
//   const agricultureKey = findMatchingKey(data, combinationData.agriculture, 'agriculture');
//   console.log('Agriculture Key:', agricultureKey);
  
//   const energyKey = findMatchingKey(data, combinationData.energy, 'energy');
//   console.log('Energy Key:', energyKey);
  
//   const irrigationKey = findMatchingKey(data, combinationData.irrigation, 'water');
//   console.log('Irrigation Key:', irrigationKey);
  
//   const climateKey = findMatchingKey(data, combinationData.climate, 'climate');
//   console.log('Climate Key:', climateKey);