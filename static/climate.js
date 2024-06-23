// Function to parse data for net net income
function parseNetNetIncomeData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(19); // Remove the first 19 lines
    const data = {
        crop: [],
        energy: [],
        all: []
    };

    // Extract column names
    const columnNames = cropsDataLines[0].split(',');
    // Find indices of columns for each category
    const cropYIndex = columnNames.indexOf('"y"');
    const energyYIndex = columnNames.indexOf('"y"', cropYIndex + 1);
    const allYIndex = columnNames.indexOf('"y"', energyYIndex + 1);
    
    // Parse data for each line
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const cropY = parseFloat(values[cropYIndex].replace(/"/g, ''));
        const energyY = parseFloat(values[energyYIndex].replace(/"/g, ''));
        const allY = parseFloat(values[allYIndex].replace(/"/g, ''));

        // Push data for each category
        data.crop.push(cropY);
        data.energy.push(energyY);
        data.all.push(allY);
    }
    // console.log(data);
    
    return data;
}

// Function to parse data for crop insurance income
function parseCropInsuranceIncomeData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(19); // Remove the first 19 lines
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

// Function to show model popup
function showModelPopup() {
    alert("Please calculate the model first.");
    // You can replace alert with a custom modal popup if needed
}

// Function to draw farm chart
function drawFarmChart() {
    // Retrieve the key from sessionStorage
    const key = sessionStorage.getItem("combination");

    // Construct the URLs dynamically using the key
    const farmNetIncomeURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/total-net-income.csv`;
    const farmInsuranceURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/income-from-crop-insurance.csv`;    

    // Fetch and parse data for farm net income and crop insurance income
    fetchAndParseCSV(farmNetIncomeURL, parseNetNetIncomeData, (netNetIncomeData) => {
        fetchAndParseCSV(farmInsuranceURL, parseCropInsuranceIncomeData, (cropInsuranceIncomeData) => {
            drawFarmCharts(netNetIncomeData, cropInsuranceIncomeData);
        });
    });
}

// Function to draw farm charts
function drawFarmCharts(netNetIncomeData, cropInsuranceIncomeData) {
    // console.log(netNetIncomeData);
    // console.log(cropInsuranceIncomeData);

    // Extract years assuming data is yearly and starts from year 1
    const years = Array.from(Array(netNetIncomeData.crop.length).keys());
    const cropData = netNetIncomeData.crop;
    const energyData = netNetIncomeData.energy;
    const allData = netNetIncomeData.all;

    // console.log(cropInsuranceIncomeData);
    const insuranceYears = Array.from(Array(cropInsuranceIncomeData.Corn.length).keys());
    const cornData = cropInsuranceIncomeData.Corn;
    const wheatData = cropInsuranceIncomeData.Wheat;
    const soybeansData = cropInsuranceIncomeData.Soybeans;
    const sgData = cropInsuranceIncomeData.SG;

    // Create the first Highcharts chart for farmNetIncome
    Highcharts.chart('chart1', {
        title: {
            text: 'Total Farm Net Income - Year: 2008 to 2098',
        },
        xAxis: {
            categories: years,
            title: {
                text: '<b>Year since the beginning of the simulation</b>',
            },
        },
        yAxis: {
            title: {
                text: '<b>Total Net Income ($)</b>',
            },
        },
        series: [
            { name: 'Crop', data: cropData, color: 'red' },
            { name: 'Energy', data: energyData, color: 'green' },
            { name: 'All', data: allData, color: 'blue' },
        ],
        // Add exporting options
        exporting: {
            filename: `TotalFarmNetIncome_${getCurrentDateTime()}`,
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                },
            },
        },
    });

    // Create the second Highcharts chart for cropInsuranceIncome
    Highcharts.chart('chart2', {
        chart: {
            type: 'scatter',
        },
        title: {
            text: 'Total Income from Crop Insurance - Year: 2008 to 2098',
        },
        xAxis: {
            categories: insuranceYears,
            title: {
                text: '<b>Year since the beginning of the simulation</b>',
            },
        },
        yAxis: {
            title: {
                text: '<b>Income from Crop Insurance ($)</b>',
            },
        },
        series: [
            { name: 'Corn', data: cornData, color: 'red' },
            { name: 'Wheat', data: wheatData, color: 'green' },
            { name: 'Soybeans', data: soybeansData, color: 'blue' },
            { name: 'SG', data: sgData, color: 'yellow' }
        ],
        // Add exporting options
        exporting: {
            filename: `TotalIncomeFromCropInsurance_${getCurrentDateTime()}`,
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                },
            },
        },
    });
}

