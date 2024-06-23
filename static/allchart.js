// Get Current Timestamp 
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


function drawAgricultureCharts() {
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

    // Main logic to draw charts
    const key = sessionStorage.getItem("combination");
    // Assuming key is obtained from sessionStorage.getItem("combination")

    // URLs with placeholders for the key
    const cropProductionUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/crop-production.csv`;
    const netIncomeUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/ag-net-income.csv`;

    // Fetch and parse crop production data
    fetchAndParseCSV(cropProductionUrl, parseData, (parsedCropData) => {
        const years = Array.from(Array(parsedCropData.Corn.length).keys());
        Highcharts.chart('chart1', {
            title: {
                text: "Crop Production (Bushels) - Year: 2008 to 2098",
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
        const soybeanIncome = netIncomeData.Soybeans;
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


// Water Chart JS

function drawWaterCharts() {
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

    // Retrieve the key from sessionStorage
    const key = sessionStorage.getItem("combination");

    // Construct the URLs dynamically using the key
    const cgwURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/crop-groundwater-irrigation.csv`;
    const cgwlURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/groundwater-level.csv`;

    // Fetch and parse crop ground water data
    fetchAndParseCSV(cgwURL, parseCropGroundWaterData, (parseCGWData) => {
        const years = Array.from(Array(parseCGWData.Corn.length).keys());

        // Create Highcharts chart for Crop Groundwater Irrigation
        Highcharts.chart('chart3', {
            title: {
                text: 'Crop Groundwater Irrigation - Year: 2008 to 2098',
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
        const years = Array.from(Array(parseGWLData.GWlevel.length).keys());

        // Create Highcharts chart for Groundwater Level
        Highcharts.chart('chart4', {
            title: {
                text: 'Groundwater Level - Year: 2008 to 2098',
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


// Energy Charts JS

function drawEnergyCharts() {
    // Helper functions
    function parseEnergyProductionData(csvData) {
        const lines = csvData.trim().split('\n');
        const cropsDataLines = lines.slice(18);
        const data = {
            wind: [],
            solar: [],
            zeroMWh: []
        };
        const columnNames = cropsDataLines[0].split(',');
        const windYIndex = columnNames.indexOf('"y"');
        const solarYIndex = columnNames.indexOf('"y"', windYIndex + 1);
        const zeroMWhYIndex = columnNames.indexOf('"y"', solarYIndex + 1);

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
        const cropsDataLines = lines.slice(18);
        const data = {
            wind: [],
            solar: [],
        };
        const columnNames = cropsDataLines[0].split(',');
        const windYIndex = columnNames.indexOf('"y"');
        const solarYIndex = columnNames.indexOf('"y"', windYIndex + 1);

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
        return `${day}${month}${year} ${hours}:${minutes}:${seconds}`;
    }

    const key = sessionStorage.getItem("combination");
    if (!key) {
        alert("Please calculate the model first.");
        return;
    }

    const energyProductionUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/farm-energy-production.csv`;
    const energyIncomeUrl = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/energy-net-income.csv`;

    fetchAndParseCSV(energyProductionUrl, parseEnergyProductionData, (EnergyProductionData) => {
        fetchAndParseCSV(energyIncomeUrl, parseEnergyIncomeData, (EnergyIncomeData) => {
            const years = Array.from(Array(EnergyProductionData.wind.length).keys());
            const windData = EnergyProductionData.wind;
            const solarData = EnergyProductionData.solar;
            const zeroMwhData = EnergyProductionData.zeroMWh;
            const netYears = Array.from(Array(EnergyIncomeData.wind.length).keys());
            const windIncome = EnergyIncomeData.wind;
            const solarIncome = EnergyIncomeData.solar;

            Highcharts.chart('chart5', {
                title: {
                    text: 'Farm Energy Production - Year: 2008 to 2098',
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
                exporting: {
                    filename: `EnergyProduction_${getCurrentDateTime()}`,
                    buttons: {
                        contextButton: {
                            menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                        },
                    },
                },
            });

            Highcharts.chart('chart6', {
                title: {
                    text: 'Energy Net Income Calculation - Year: 2008 to 2098',
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
                exporting: {
                    filename: `EnergyNetIncome_${getCurrentDateTime()}`,
                    buttons: {
                        contextButton: {
                            menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                        },
                    },
                },
            });
        });
    });
}

function drawFarmCharts() {
    // Helper functions
    function parseNetNetIncomeData(csvData) {
        const lines = csvData.trim().split('\n');
        const cropsDataLines = lines.slice(19);
        const data = {
            crop: [],
            energy: [],
            all: []
        };
        const columnNames = cropsDataLines[0].split(',');
        const cropYIndex = columnNames.indexOf('"y"');
        const energyYIndex = columnNames.indexOf('"y"', cropYIndex + 1);
        const allYIndex = columnNames.indexOf('"y"', energyYIndex + 1);

        for (let i = 1; i < cropsDataLines.length; i++) {
            const line = cropsDataLines[i];
            const values = line.split(',');
            const cropY = parseFloat(values[cropYIndex].replace(/"/g, ''));
            const energyY = parseFloat(values[energyYIndex].replace(/"/g, ''));
            const allY = parseFloat(values[allYIndex].replace(/"/g, ''));

            data.crop.push(cropY);
            data.energy.push(energyY);
            data.all.push(allY);
        }
        return data;
    }

    function parseCropInsuranceIncomeData(csvData) {
        const lines = csvData.trim().split('\n');
        const cropsDataLines = lines.slice(19);
        const data = {
            Corn: [],
            Wheat: [],
            Soybeans: [],
            SG: []
        };
        const columnNames = cropsDataLines[0].split(',');
        const cornYIndex = columnNames.indexOf('"y"');
        const wheatYIndex = columnNames.indexOf('"y"', cornYIndex + 1);
        const soybeansYIndex = columnNames.indexOf('"y"', wheatYIndex + 1);
        const sgYIndex = columnNames.indexOf('"y"', soybeansYIndex + 1);

        for (let i = 1; i < cropsDataLines.length; i++) {
            const line = cropsDataLines[i];
            const values = line.split(',');
            const cornY = parseFloat(values[cornYIndex].replace(/"/g, ''));
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
        return `${day}${month}${year} ${hours}:${minutes}:${seconds}`;
    }

    const key = sessionStorage.getItem("combination");
    if (!key) {
        alert("Please calculate the model first.");
        return;
    }

    const farmNetIncomeURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/total-net-income.csv`;
    const farmInsuranceURL = `https://raw.githubusercontent.com/Pratik-Nikam/FEWtureFarm/main/data/outputs/${key}/income-from-crop-insurance.csv`;

    fetchAndParseCSV(farmNetIncomeURL, parseNetNetIncomeData, (netNetIncomeData) => {
        fetchAndParseCSV(farmInsuranceURL, parseCropInsuranceIncomeData, (cropInsuranceIncomeData) => {
            const years = Array.from(Array(netNetIncomeData.crop.length).keys());
            const cropData = netNetIncomeData.crop;
            const energyData = netNetIncomeData.energy;
            const allData = netNetIncomeData.all;
            const insuranceYears = Array.from(Array(cropInsuranceIncomeData.Corn.length).keys());
            const cornData = cropInsuranceIncomeData.Corn;
            const wheatData = cropInsuranceIncomeData.Wheat;
            const soybeansData = cropInsuranceIncomeData.Soybeans;
            const sgData = cropInsuranceIncomeData.SG;

            Highcharts.chart('chart7', {
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
                exporting: {
                    filename: `TotalFarmNetIncome_${getCurrentDateTime()}`,
                    buttons: {
                        contextButton: {
                            menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                        },
                    },
                },
            });

            Highcharts.chart('chart8', {
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
                exporting: {
                    filename: `TotalIncomeFromCropInsurance_${getCurrentDateTime()}`,
                    buttons: {
                        contextButton: {
                            menuItems: ["downloadPNG", "downloadJPEG", "downloadPDF", "downloadSVG", "downloadXLS", "downloadCSV"],
                        },
                    },
                },
            });
        });
    });
}



function showCharts(chartType) {
    // Hide all chart containers
    document.querySelectorAll('.charts').forEach(container => {
        container.style.display = 'none';
    });

    // Show the relevant chart container
    if (chartType === 'agriculture') {
        drawAgricultureCharts();
        document.getElementById('agriculture-charts').style.display = 'block';
    } else if (chartType === 'water') {
        drawWaterCharts();
        document.getElementById('water-charts').style.display = 'block';
    } else if (chartType === 'energy') {
        drawEnergyCharts();
        document.getElementById('energy-charts').style.display = 'block';
    } else if (chartType === 'farm') {
        drawFarmCharts();
        document.getElementById('farm-charts').style.display = 'block';
    } else if (chartType === 'all') {
        drawAgricultureCharts();
        drawWaterCharts();
        drawEnergyCharts();
        drawFarmCharts();
        document.getElementById('agriculture-charts').style.display = 'block';
        document.getElementById('water-charts').style.display = 'block';
        document.getElementById('energy-charts').style.display = 'block';
        document.getElementById('farm-charts').style.display = 'block';
    }
}


