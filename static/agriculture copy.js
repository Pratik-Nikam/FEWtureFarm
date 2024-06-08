// Function to construct file path based on the key
// Function to fetch and draw agriculture charts
console.log("Agriculture.js loaded");
function drawAgricultureChart() {
    // Put your logic here to fetch and draw agriculture charts
    function getFilePath(key, fileType) {
        return `data/outputs/${key}/${fileType}.csv`;
    }

    // // Function to read CSV data from file
    // function readCSVFile(key, fileType, callback) {
        
    // 074617952

    // Function to read CSV data from file
    function readCSVFile(key, fileType, callback) {

        const csvUrl =  "https://cdn.ku.edu/fewture-farms/C1A1E1W1/crop-production.csv"

        fetch(csvUrl)

      .then(response => response.text())

      .then(csvText => {

        Papa.parse(csvText, {

          header: true,

          complete: function(results) {

            console.log(results.data); 

          },

          error: function(error) {

            console.error(error.message); 

          }

        });

      })

      .catch(error => {

        console.error('Error fetching the CSV file:', error.message);

      });

        const filePath = getFilePath(key, fileType);
        fetch(filePath)
            .then(response => response.text())
            .then(csvData => {
                // Papa.parse(csvData, {
                //     header: false,
                //     delimiter: "\t",
                //     complete: callback
                // });

                document.getElementById('out').innerText = csvData;
            })
            .catch(error => console.error('Error fetching CSV file:', error));
    }


    // Base64-encoded JSON data
    // function readCSVFile(key, fileType, callback) {
       
    //     // Create the data URL
    //     const dataUrl = 'data:application/json;base64,' + base64Data;
    //     console.log(dataUrl);
    //     // Fetch the JSON data from the data URL
    //     fetch(dataUrl)
    //         .then(response => response.json())
    //         .then(data => {
    //             // Use the JSON data here
    //             console.log(data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching JSON data:', error);
    //         });
    // }

    function processCropProductionData(results) {
        let data = results.data.slice(16); // Skipping first 15 rows
        data = data.map(row => row[0].split(','));

        let cropProductionData = {
            year: [],
            corn: [],
            wheat: [],
            soybean: [],
            sg: []
        };

        data.forEach(row => {
            cropProductionData.year.push(row[0]);
            cropProductionData.corn.push(parseInt(row[1].replace(/"/g, '')));
            cropProductionData.wheat.push(parseInt(row[5].replace(/"/g, '')));
            cropProductionData.soybean.push(parseInt(row[9].replace(/"/g, '')));
            cropProductionData.sg.push(parseInt(row[13].replace(/"/g, '')));
        });

        return cropProductionData;
    }

    function processNetIncomeData(results) {
        let data = results.data.slice(17); // Skipping first 16 rows
        data = data.map(row => row[0].split(','));

        let netIncomeData = {
            year: [],
            corn: [],
            wheat: [],
            soybean: [],
            sg: [],
            us0: []
        };

        data.forEach(row => {
            netIncomeData.year.push(row[0]);
            netIncomeData.corn.push(parseFloat(row[1].replace(/"/g, '')));
            netIncomeData.wheat.push(parseFloat(row[5].replace(/"/g, '')));
            netIncomeData.soybean.push(parseFloat(row[9].replace(/"/g, '')));
            netIncomeData.sg.push(parseFloat(row[13].replace(/"/g, '')));
            netIncomeData.us0.push(parseFloat(row[17].replace(/"/g, '')));
        });

        return netIncomeData;
    }

    // Event listener for file input change
    document.getElementById('drawChartsButton').addEventListener('click', function () {
        const combination = sessionStorage.getItem("combination");

        if (combination) {
            readCSVFile(combination, 'crop-production', function (cropProductionResults) {
                const cropProductionData = processCropProductionData(cropProductionResults);
                // Draw charts using crop production data
            });

            // readCSVFile(combination, 'ag-net-income', function (netIncomeResults) {
            //     const netIncomeData = processNetIncomeData(netIncomeResults);
            //     // Draw charts using net income data
            // });
        } else {
            alert('Combination not found.');
        }
    });



}
