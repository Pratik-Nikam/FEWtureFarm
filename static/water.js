// Function to parse crop ground water data from CSV
function parseCropGroundWaterData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(19); // Remove the first 20 lines (headers and other info)
    const data = {
        Corn: [],
        Wheat: [],
        Soybeans: [],
        SG: []
    };

    // Find the indices of the 'y' columns for each crop
    const columnNames = cropsDataLines[0].split(',');
    const cornYIndex = columnNames.indexOf('"y"');
    const wheatYIndex = columnNames.indexOf('"y"', cornYIndex + 1);
    const soybeansYIndex = columnNames.indexOf('"y"', wheatYIndex + 1);
    const sgYIndex = columnNames.indexOf('"y"', soybeansYIndex + 1);

    // Parse data for each crop
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');
        const cornY = parseFloat(values[cornYIndex].replace(/"/g, '')); // Remove quotes and convert to float
        const wheatY = parseFloat(values[wheatYIndex].replace(/"/g, ''));
        const soybeansY = parseFloat(values[soybeansYIndex].replace(/"/g, ''));
        const sgY = parseFloat(values[sgYIndex].replace(/"/g, ''));

        data.Corn.push(cornY);
        data.Wheat.push(wheatY);
        data.Soybeans.push(soybeansY);
        data.SG.push(sgY);
    }
    return data;
}

// Function to parse crop water level data from CSV
function parseCropWaterLevelData(csvData) {
    const lines = csvData.trim().split('\n');
    const cropsDataLines = lines.slice(18); // Remove the first 18 lines (headers and other info)
    const data = {
        GWlevel: [],
        Min_Aq: [],
        MinPlus30: []
    };

    // Find the indices of the 'y' columns for each water level data
    const columnNames = cropsDataLines[0].split(',');
    const GWlevelIndex = columnNames.indexOf('"y"');
    const Min_AqIndex = columnNames.indexOf('"y"', GWlevelIndex + 1);
    const MinPlus30Index = columnNames.indexOf('"y"', Min_AqIndex + 1);

    // Parse data for each water level
    for (let i = 1; i < cropsDataLines.length; i++) {
        const line = cropsDataLines[i];
        const values = line.split(',');

        const GWlevelY = parseFloat(values[GWlevelIndex].replace(/"/g, '')); // Remove quotes and convert to float
        const Min_AqY = parseFloat(values[Min_AqIndex].replace(/"/g, ''));
        const MinPlus30Y = parseFloat(values[MinPlus30Index].replace(/"/g, ''));

        data.GWlevel.push(GWlevelY);
        data.Min_Aq.push(Min_AqY);
        data.MinPlus30.push(MinPlus30Y);
    }
    return data;
}

// Function to fetch and parse CSV data
function fetchAndParseCSV(url, parser, callback) {
    fetch(url)
        .then(response => response.text()) // Get CSV as text
        .then(csvText => {
            const parsedData = parser(csvText); // Parse CSV using the provided parser function
            callback(parsedData); // Call the callback with parsed data
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV:', error);
        });
}

// Function to get current date and time in a specific format
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

// Function to show a popup asking the user to calculate the model
function showModelPopup() {
    alert("Please calculate the model first.");
    // You can replace alert with a custom modal popup if needed
}

// Function to draw water-related charts
function drawWaterChart() {
    // Retrieve the key from sessionStorage
    const key = sessionStorage.getItem("combination");

    // Construct the URLs dynamically using the key
    const cgwURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W1/crop-groundwater-irrigation.csv`;
    const cgwlURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/C1A1E1W1/groundwater-level.csv`;

    // Fetch and parse crop ground water data
    fetchAndParseCSV(cgwURL, parseCropGroundWaterData, (parseCGWData) => {
        console.log(parseCGWData);
        const years = Array.from(Array(parseCGWData.Corn.length).keys());

        // Create Highcharts chart for Crop Groundwater Irrigation
        Highcharts.chart('chart1', {
            title: {
                text: 'Crop Groundwater Irrigation',
            },
            xAxis: {
                categories: years,
                title: {
                    text: '<b>Year since the beginning of the simulation</b>',
                },
            },
            yAxis: {
                title: {
                    text: '<b>Irrigation (Inches)</b>',
                },
            },
            series: [
                { name: 'Corn', data: parseCGWData.Corn, color: 'red' },
                { name: 'Wheat', data: parseCGWData.Wheat, color: 'green' },
                { name: 'Soybeans', data: parseCGWData.Soybeans, color: 'blue' },
                { name: 'SG', data: parseCGWData.SG, color: 'orange' }
            ],
            exporting: {
                filename: `CropIrrigation_${getCurrentDateTime()}`,
                buttons: {
                    contextButton: {
                        menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                    },
                },
            },
        });
    });

    // Fetch and parse crop water level data
    fetchAndParseCSV(cgwlURL, parseCropWaterLevelData, (parseGWLData) => {
        console.log(parseGWLData);
        const years = Array.from(Array(parseGWLData.GWlevel.length).keys());

        // Create Highcharts chart for Groundwater Level
        Highcharts.chart('chart2', {
            title: {
                text: 'Groundwater Level',
            },
            xAxis: {
                categories: years,
                title: {
                    text: '<b>Year since the beginning of the simulation</b>',
                },
            },
            yAxis: {
                title: {
                    text: '<b>Groundwater Level (Feet)</b>',
                },
            },
            series: [
                { name: 'GW Level', data: parseGWLData.GWlevel, color: 'red' },
                { name: 'Min Aq', data: parseGWLData.Min_Aq, color: 'green' },
                { name: 'Min Plus 30', data: parseGWLData.MinPlus30, color: 'blue' }
            ],
            exporting: {
                filename: `GroundwaterLevel_${getCurrentDateTime()}`,
                buttons: {
                    contextButton: {
                        menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                    },
                },
            },
        });
    });
}