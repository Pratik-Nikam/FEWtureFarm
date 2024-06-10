console.log("NetlogoInputV1.js loaded");

$(document).ready(function () {
    // Update the slider value display
    $("#num_of_years").on("input", function () {
        $("#slider-value").text($(this).val());
    });

    // Handle form submission
    $("#MainForm").submit(function (e) {
        e.preventDefault();
        extractFormData();
    });

    // Function to extract form data
    function extractFormData() {
        var formData = $("#MainForm").serializeArray();
        var formattedData = {};

        // Convert form data to key-value pairs
        formData.forEach(function (field) {
            formattedData[field.name] = field.value;

            // Check for specific conditions and modify data if necessary
            if (
                field.name === "climate_model" &&
                field.value === "RCP4.5" &&
                formattedData["future_processes"] === "Repeat Historical"
            ) {
                formattedData["climate_model"] = null;
            }
        });

        // Perform additional processing or send data to the server here

        // Example: Sending the data to the server via AJAX

        // Find combination based on form data
        var combination = findCombination(formattedData);
        sessionStorage.setItem("combination", combination);
        console.log(sessionStorage.getItem("combination"));
        console.log("Combination: " + combination);
    }

    // Function to convert form data to CSV format
    $("#download-button").click(function (e) {
        e.preventDefault();
        var formData = $("#MainForm").serializeArray();
        var csvData = convertToCSV(formData);
        downloadCSV(csvData, "form_data.csv");
    });

    // Function to convert form data to CSV format
    function convertToCSV(formData) {
        var csvRows = [];

        // Add header row
        csvRows.push("Field,Value");

        // Add data rows
        formData.forEach(function (field) {
            csvRows.push(`${field.name},${field.value}`);
        });

        return csvRows.join("\n");
    }

    // Function to download CSV file
    function downloadCSV(csvData, filename) {
        var blob = new Blob([csvData], { type: "text/csv" });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.setAttribute("hidden", "");
        a.setAttribute("href", url);
        a.setAttribute("download", filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    const data = {
        agriculture: {
            A1: {
                corn_area: 500,
                wheat_area: 125,
                soybeans_area: 0,
                sg_area: 125,
            },
            A2: {
                corn_area: 150,
                wheat_area: 200,
                soybeans_area: 200,
                sg_area: 200,
            },
        },
        energy: {
            E1: {
                energy_value: 38,
                loan_term: 20,
                interest: 3,
                num_wind_turbines: 4,
                nyear_w: 30,
                capacity_w: 2,
                cost_w: 1470,
                degrade_w: 1,
                wind_factor: 25,
                num_panel_sets: 10,
                nyear_s: 25,
                cost_s: 1750,
                capacity_s: 250,
                degrade_s: 1,
                sun_hrs: 6,
                ptc_w: 0.03,
                itc_s: 30,
                ptc_s: 0.03,
            },
            E2: {
                energy_value: 45,
                loan_term: 20,
                interest: 3,
                num_wind_turbines: 4,
                nyear_w: 30,
                capacity_w: 2,
                cost_w: 1470,
                degrade_w: 1,
                wind_factor: 42,
                num_panel_sets: 10,
                nyear_s: 25,
                cost_s: 1750,
                capacity_s: 250,
                degrade_s: 1,
                sun_hrs: 6,
                ptc_w: 0.03,
                itc_s: 30,
                ptc_s: 0.03,
            },
            E3: {
                energy_value: 45,
                loan_term: 20,
                interest: 3,
                num_wind_turbines: 4,
                nyear_w: 30,
                capacity_w: 2,
                cost_w: 1470,
                degrade_w: 1,
                wind_factor: 42,
                num_panel_sets: 10,
                nyear_s: 25,
                cost_s: 1750,
                capacity_s: 250,
                degrade_s: 1,
                sun_hrs: 6,
                ptc_w: 0.03,
                itc_s: 30,
                ptc_s: 0.03,
            },
            E4: {
                energy_value: 45,
                loan_term: 20,
                interest: 3,
                num_wind_turbines: 4,
                nyear_w: 30,
                capacity_w: 2,
                cost_w: 1470,
                degrade_w: 1,
                wind_factor: 42,
                num_panel_sets: 10,
                nyear_s: 25,
                cost_s: 1750,
                capacity_s: 250,
                degrade_s: 1,
                sun_hrs: 8,
                ptc_w: 0.03,
                itc_s: 30,
                ptc_s: 0.03,
            },
        },
        water: {
            
            W1: { aquifier_level: 300, min_aquifier_level: 30 },
        },
        climate: {
            C1: { future_processes: "Repeat Historical", climate_model: null },
            C2: { future_processes: "Wetter Future", climate_model: null },
            C3: { future_processes: "Dryer Future", climate_model: null },
            C4: { future_processes: "GCM", climate_model: "RCP4.5" },
            C5: { future_processes: "GCM", climate_model: "RCP8.5" },
        },
    };


    function findCombination(formData) {
        // Initialize variables to hold keys for different categories
        let agriKey, energyKey, waterKey, climateKey;
    
        // Loop through agriculture data to find a matching key
        for (const [key, value] of Object.entries(data.agriculture)) {
            // Check if the current agriculture data matches the form data
            if (
                JSON.stringify(value) ===
                JSON.stringify({
                    corn_area: parseInt(formData.corn_area),
                    wheat_area: parseInt(formData.wheat_area),
                    soybeans_area: parseInt(formData.soybeans_area),
                    sg_area: parseInt(formData.sg_area),
                })
            ) {
                agriKey = key; // If matched, assign the key
                break; // Break the loop since the key is found
            }
        }
    
        // Loop through energy data to find a matching key
        for (const [key, value] of Object.entries(data.energy)) {
            // Check if the current energy data matches the form data
            if (
                JSON.stringify(value) ===
                JSON.stringify({
                    energy_value: parseInt(formData.energy_value),
                    loan_term: parseInt(formData.loan_term),
                    interest: parseInt(formData.interest),
                    num_wind_turbines: parseInt(formData.num_wind_turbines),
                    nyear_w: parseInt(formData.nyear_w),
                    capacity_w: parseInt(formData.capacity_w),
                    cost_w: parseInt(formData.cost_w),
                    degrade_w: parseInt(formData.degrade_w),
                    wind_factor: parseInt(formData.wind_factor),
                    num_panel_sets: parseInt(formData.num_panel_sets),
                    nyear_s: parseInt(formData.nyear_s),
                    cost_s: parseInt(formData.cost_s),
                    capacity_s: parseInt(formData.capacity_s),
                    degrade_s: parseInt(formData.degrade_s),
                    sun_hrs: parseInt(formData.sun_hrs),
                    ptc_w: parseFloat(formData.ptc_w),
                    itc_s: parseFloat(formData.itc_s),
                    ptc_s: parseFloat(formData.ptc_s),
                })
            ) {
                energyKey = key; // If matched, assign the key
                break; // Break the loop since the key is found
            }
        }
    
        // Loop through water data to find a matching key
        for (const [key, value] of Object.entries(data.water)) {
            // Check if the current water data matches the form data
            if (
                JSON.stringify(value) ===
                JSON.stringify({
                    aquifier_level: parseInt(formData.aquifier_level),
                    min_aquifier_level: parseInt(formData.min_aquifier_level),
                })
            ) {
                waterKey = key; // If matched, assign the key
                break; // Break the loop since the key is found
            }
        }
    
        // Loop through climate data to find a matching key
        for (const [key, value] of Object.entries(data.climate)) {
            // Check if the current climate data matches the form data
            if (
                JSON.stringify(value) ===
                JSON.stringify({
                    future_processes: formData.future_processes,
                    climate_model: formData.climate_model || null,
                })
            ) {
                climateKey = key; // If matched, assign the key
                break; // Break the loop since the key is found
            }
        }
    
        // Check if keys for all categories are found
        if (agriKey && energyKey && waterKey && climateKey) {
            // If keys for all categories are found, return the combination
            return `${climateKey}${agriKey}${energyKey}${waterKey}`;
        } else {
            // If any key is missing, return a message indicating no matching combination found
            return "No matching combination found.";
        }
    }
    
});