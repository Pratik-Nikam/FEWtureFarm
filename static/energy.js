function parseEnergyProductionData(csvData) {
    // Split CSV data into lines
    const lines = csvData.trim().split('\n');
    // Remove the first 18 lines (assuming they're headers or metadata)
    const cropsDataLines = lines.slice(18);
    // Initialize an object to store parsed data
    const data = {
        wind: [],
        solar: [],
        zeroMWh: []
    };

    // Extract column names from the first line of data
    const columnNames = cropsDataLines[0].split(',');
    // Find the indices of relevant columns
    const windYIndex = columnNames.indexOf('"y"');
    const solarYIndex = columnNames.indexOf('"y"', windYIndex + 1);
    const zeroMWhYIndex = columnNames.indexOf('"y"', solarYIndex + 1);

    // Parse each line of data and populate the object
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const windY = parseFloat(values[windYIndex].replace(/"/g, ''));
        const solarY = parseFloat(values[solarYIndex].replace(/"/g, ''));
        const zeroMWhY = parseFloat(values[zeroMWhYIndex].replace(/"/g, ''));

        data.wind.push(windY);
        data.solar.push(solarY);
        data.zeroMWh.push(zeroMWhY);
    }
    return data;
}

function parseEnergyIncomeData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(18); // Remove the first 18 lines

    // Initialize an object to store parsed data
    const data = {
        wind: [],
        solar: [],
    };

    // Extract column names from the first line of data
    const columnNames = cropsDataLines[0].split(',');
    // Find the indices of relevant columns
    const windYIndex = columnNames.indexOf('"y"');
    const solarYIndex = columnNames.indexOf('"y"', windYIndex + 1);

    // Parse each line of data and populate the object
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const windY = parseFloat(values[windYIndex].replace(/"/g, ''));
        const solarY = parseFloat(values[solarYIndex].replace(/"/g, ''));

        data.wind.push(windY);
        data.solar.push(solarY);
    }
    return data;
}

function fetchAndParseCSV(url, parser, callback) {
    // Fetch CSV data from the provided URL
    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            // Parse CSV data using the provided parser function
            const parsedData = parser(csvText);
            // Execute the callback function with the parsed data
            callback(parsedData);
        })
        .catch(error => {
            // Handle errors related to fetching or parsing CSV data
            console.error('Error fetching or parsing CSV:', error);
        });
}

// Generate formatted current date and time
function getCurrentDateTime() {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const formattedDateTime = `${day}${month}${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

// Display a popup indicating the need to calculate the model first
function showModelPopup() {
    alert("Please calculate the model first.");
    // You can replace alert with a custom modal popup if needed
}

// Function to draw energy charts
function drawEnergyChart() {
    // Retrieve the key from sessionStorage
    const key = sessionStorage.getItem("combination");

    // Construct the URLs dynamically using the key
    const energyProductionUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W1/farm-energy-production.csv`;
    const energyIncomeUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W1/energy-net-income.csv`;

    // Fetch and parse CSV data for energy production and income
    fetchAndParseCSV(energyProductionUrl, parseEnergyProductionData, (EnergyProductionData) => {
        fetchAndParseCSV(energyIncomeUrl, parseEnergyIncomeData, (EnergyIncomeData) => {
            // Once data is parsed, draw energy charts
            drawEnergyCharts(EnergyProductionData, EnergyIncomeData);
        });
    });
}

// Function to draw energy charts based on parsed data
function drawEnergyCharts(EnergyProductionData, EnergyIncomeData) {
    // Assuming data is yearly and starts from year 1
    const years = Array.from(Array(EnergyProductionData.wind.length).keys());
    const windData = EnergyProductionData.wind;
    const solarData = EnergyProductionData.solar;
    const zeroMwhData = EnergyProductionData.zeroMWh;

    // Assuming data is yearly and starts from year 1
    const netYears = Array.from(Array(EnergyIncomeData.wind.length).keys());
    const windIncome = EnergyIncomeData.wind;
    const solarIncome = EnergyIncomeData.solar;

    // Create the first Highcharts chart for farmEnergyProduction
    Highcharts.chart('chart1', {
        title: {
            text: 'Farm Energy Production',
        },
        xAxis: {
            categories: years,
            title: {
                text: '<b>Year since the beginning of the simulation</b>',
            },
        },
        yAxis: {
            title: {
                text: '<b>Production (MWh)</b>',
            },
        },
        series: [
            { name: 'Wind', data: windData, color: 'red' },
            { name: 'Solar', data: solarData, color: 'green' },
            { name: '0 MWh', data: zeroMwhData, color: 'blue' },
        ],
        // Add exporting options
        exporting: {
            filename: `EnergyProduction_${getCurrentDateTime()}`,
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                },
            },
        },
    });

    // Create the second Highcharts chart for energyNetIncomeCalculation
    Highcharts.chart('chart2', {
        title: {
            text: 'Energy Net Income Calculation',
        },
        xAxis: {
            categories: netYears,
            title: {
                text: '<b>Year since the beginning of the simulation</b>',
            },
        },
        yAxis: {
            title: {
                text: '<b>Income ($)</b>',
            },
        },
        series: [
            { name: 'Wind', data: windIncome, color: 'red' },
            { name: 'Solar', data: solarIncome, color: 'green' },
        ],
        // Add exporting options
        exporting: {
            filename: `EnergyNetIncome_${getCurrentDateTime()}`,
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                },
            },
        },
    });
}

