var script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.0/papaparse.min.js';
document.head.appendChild(script);

const csvUrl = "https://cdn.ku.edu/fewture-farms/C1A1E1W1/crop-production.csv"


fetch(csvUrl).then(response => response.text()).then(csvText => {Papa.parse(csvText, {header: true,complete: function (results) {console.log(results.data);},error: function (error) {console.error(error.message);}});})

    .catch(error => {

        console.error('Error fetching the CSV file:', error.message);

    });
