// Generate Current Date and Time
let ag_data = null;
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

// Function to fetch CSV data and draw charts
function drawAgricultureChart() {
    // Define the URL of the CSV file
    const csvUrl = "https://cdn.ku.edu/fewture-farms/C1A1E1W1/crop-production.csv";
    var results = [];
    // Fetch the CSV content
    fetch(csvUrl)
        .then(response => response.text())
        .then(csvText => {
            // Parse the CSV data using PapaParse
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    ag_data = results.data;
                    console.log(ag_data[0])
    console.log(ag_data[1])
console.log(ag_data[11])
console.log(ag_data[21])    
                    // console.log(results.data); // Check the parsed data in console
                    // Now you can use the parsed data to draw charts
                    // Implement your chart drawing logic here
                },
                error: function(error) {
                    console.error(error.message);
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the CSV file:', error.message);
        });
        return results.data;
}




// Call the drawCharts function when the page loads
document.addEventListener('DOMContentLoaded', drawAgricultureChart);
