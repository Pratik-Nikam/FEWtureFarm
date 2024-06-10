// Function to parse crop production data from CSV
function parseData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(19); // Remove the first 20 lines
    const data = {
        Corn: [],
        Wheat: [],
        Soybeans: [],
        SG: []
    };

    // Extract column names
    const columnNames = cropsDataLines[0].split(',');
    // Find indices of columns for each crop
    const cornYIndex = columnNames.indexOf('"y"');
    const wheatYIndex = columnNames.indexOf('"y"', cornYIndex + 1);
    const soybeansYIndex = columnNames.indexOf('"y"', wheatYIndex + 1);
    const sgYIndex = columnNames.indexOf('"y"', soybeansYIndex + 1);

    // Parse data for each line
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const cornY = parseFloat(values[cornYIndex].replace(/"/g, ''));
        const wheatY = parseFloat(values[wheatYIndex].replace(/"/g, ''));
        const soybeansY = parseFloat(values[soybeansYIndex].replace(/"/g, ''));
        const sgY = parseFloat(values[sgYIndex].replace(/"/g, ''));

        // Push data for each crop
        data.Corn.push(cornY);
        data.Wheat.push(wheatY);
        data.Soybeans.push(soybeansY);
        data.SG.push(sgY);
    }

    return data;
}

// Function to parse net income data from CSV
function parseNetIncomeData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(20); // Remove the first 20 lines
    const data = {
        Corn: [],
        Wheat: [],
        Soybeans: [],
        SG: []
    };

    // Extract column names
    const columnNames = cropsDataLines[0].split(',');
    // Find indices of columns for each crop
    const cornYIndex = columnNames.indexOf('"y"');
    const wheatYIndex = columnNames.indexOf('"y"', cornYIndex + 1);
    const soybeansYIndex = columnNames.indexOf('"y"', wheatYIndex + 1);
    const sgYIndex = columnNames.indexOf('"y"', soybeansYIndex + 1);

    // Parse data for each line
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const cornY = parseFloat(values[cornYIndex].replace(/"/g, ''));
        const wheatY = parseFloat(values[wheatYIndex].replace(/"/g, ''));
        const soybeansY = parseFloat(values[soybeansYIndex].replace(/"/g, ''));
        const sgY = parseFloat(values[sgYIndex].replace(/"/g, ''));

        // Push data for each crop
        data.Corn.push(cornY);
        data.Wheat.push(wheatY);
        data.Soybeans.push(soybeansY);
        data.SG.push(sgY);
    }

    return data;
}

// Function to fetch and parse CSV data
function fetchAndParseCSV(url, parser, callback) {
    fetch(url)
        .then(response => response.text())
        .then(csvText => {
            const parsedData = parser(csvText);
            callback(parsedData);
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV:', error);
        });
}

// Function to get current date and time
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

// Function to draw agriculture chart
function drawAgricultureChart() {
    key = sessionStorage.getItem("combination")
    const cropProductionUrl = "https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W2/crop-production.csv";
    const netIncomeUrl = "https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W2/ag-net-income.csv";

    // Fetch and parse crop production data
    fetchAndParseCSV(cropProductionUrl, parseData, (parsedCropData) => {
        const years = Array.from(Array(parsedCropData.Corn.length).keys());
        Highcharts.chart('chart1', {
            title: {
                text: "Crop Production (Bushels) - Start Year: 2008",
            },
            xAxis: {
                categories: years,
                title: {
                    text: '<b>Year since the beginning of the simulation</b>'
                },
            },
            yAxis: {
                title: {
                    text: '<b>Production (Bushels/Acre)</b>',
                },
            },
            series: [
                { name: 'Corn', data: parsedCropData.Corn, color: 'red' },
                { name: 'Wheat', data: parsedCropData.Wheat, color: 'green' },
                { name: 'Soybeans', data: parsedCropData.Soybeans, color: 'blue' },
                { name: 'SG', data: parsedCropData.SG, color: 'orange' }
            ],
            exporting: {
                filename: `CropProduction_${getCurrentDateTime()}`,
                buttons: {
                    contextButton: {
                        menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                    },
                },
            },
        });
    });

    // Fetch and parse net income data
    fetchAndParseCSV(netIncomeUrl, parseNetIncomeData, (netIncomeData) => {
        const netYears = Array.from(Array(netIncomeData.Corn.length).keys());
        const cornIncome = netIncomeData.Corn;
        const wheatIncome = netIncomeData.Wheat;
        const soybeanIncome = netIncomeData.Soybean;
        const sgIncome = netIncomeData.SG;

        Highcharts.chart('chart2', {
            title: {
                text: "Agriculture Net Income",
            },
            xAxis: {
                categories: netYears,
                title: {
                    text: '<b>Year since the beginning of the simulation</b>',
                },
            },
            yAxis: {
                title: {
                    text: '<b> Income ($) </b>',
                },
            },
            series: [

                { name: 'Corn', data: cornIncome, color: 'red' },
                { name: 'Wheat', data: wheatIncome, color: 'green' },
                { name: 'Soybeans', data: soybeanIncome, color: 'blue' },
                { name: 'SG', data: sgIncome, color: 'orange' },
            ],
            exporting: {
                filename: `AgricultureNetIncome_${getCurrentDateTime()}`,
                buttons: {
                    contextButton: {
                        menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                    },
                },
            },
        });
    });
}

// Draw agriculture chart when the DOM content is loaded
// document.addEventListener('DOMContentLoaded', drawAgricultureChart);

