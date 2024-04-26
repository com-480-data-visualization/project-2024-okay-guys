 // Sample data format
/* 
const data = [
    { Country: "France", NOC: "FRA", Season: "Summer", Year: "1896", Gold: "0.0", Silver: "1.0", Bronze: "0.0", None: "3.0" },
    { Country: "USA", NOC: "USA", Season: "Summer", Year: "1896", Gold: "1.0", Silver: "1.0", Bronze: "1.0", None: "3.0" },
    // Add more data here
];
 */

let data = [];

// Function to populate year options based on data
/* function populateYears() {
    const yearSelect = document.getElementById('yearSelect');
    const years = [...new Set(data.map(item => item.Year))];
    console.log("pop data", data);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.text = year;
        yearSelect.appendChild(option);
    });
} */


function populateYears() {
    const yearSeasonSelect = document.getElementById('yearSeasonSelect');
    const yearSeasons = [...new Set(data.map(item => item.Year + " - " + item.Season))];
    yearSeasons.forEach(yearSeason => {
        const option = document.createElement('option');
        option.value = yearSeason;
        option.text = yearSeason;
        yearSeasonSelect.appendChild(option);
    });
}


function updateChart() {
    //const selectedYear = document.getElementById('yearSelect').value;
    const selectedYearSeason = document.getElementById('yearSeasonSelect').value;
    const [selectedYear, selectedSeason] = selectedYearSeason.split(" - ");
    //const selectedSeason = document.getElementById('seasonSelect').value;
    console.log("chart data", data);

    //let filteredData = data.filter(item => item.Year === selectedYear && item.Season === selectedSeason);
    let filteredData = data.filter(item => String(item.Year) === selectedYear && item.Season === selectedSeason);

    console.log(filteredData);

    // Aggregate medals by country
    const medalCounts = filteredData.reduce((acc, item) => {
        const country = item.Country;
        acc[country] = acc[country] || { Gold: 0, Silver: 0, Bronze: 0 };
        acc[country].Gold += parseFloat(item.Gold);
        acc[country].Silver += parseFloat(item.Silver);
        acc[country].Bronze += parseFloat(item.Bronze);
        return acc;
    }, {});

    // Convert object to array and sort by Gold, Silver, Bronze
    const sortedMedals = Object.entries(medalCounts).map(([country, medals]) => ({
        Country: country,
        ...medals
    })).sort((a, b) => b.Gold - a.Gold || b.Silver - a.Silver || b.Bronze - a.Bronze).slice(0, 10); // Top 10 countries

    const ctx = document.getElementById('medalChart').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy(); // Destroy existing chart instance if exists
    }
    window.myChart = new Chart(ctx, {
        type: 'bar', // Correct chart type for horizontal bars in Chart.js 3.x
        data: {
            labels: sortedMedals.map(item => item.Country),
            datasets: [{
                label: 'Gold',
                data: sortedMedals.map(item => item.Gold),
                backgroundColor: 'rgba(255, 215, 0, 0.7)',
                borderColor: 'rgba(255, 215, 0, 1)',
                borderWidth: 1
            }, {
                label: 'Silver',
                data: sortedMedals.map(item => item.Silver),
                backgroundColor: 'rgba(192, 192, 192, 0.7)',
                borderColor: 'rgba(192, 192, 192, 1)',
                borderWidth: 1
            }, {
                label: 'Bronze',
                data: sortedMedals.map(item => item.Bronze),
                backgroundColor: 'rgba(205, 127, 50, 0.7)',
                borderColor: 'rgba(205, 127, 50, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // Ensures the bar chart is horizontal
            responsive: false,
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1, // Forces the ticks to increment by 1
                        precision: 0, // Ensures no decimal places
                        callback: function(value) {
                            if (value % 1 === 0) { // Only display integer values
                                return value;
                            }
                        }
                    }
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

/* window.onload = function() {
    populateYears();
    updateChart();  // Initial chart display
    console.log(data);
}; */


window.onload = function() {
    Papa.parse("../data/medals/medal_distribution.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data;
            console.log(data);
            populateYears();
            updateChart(); // Initialize the chart after data is loaded and processed
        }
    })
    //console.log("Global Data Check:", data);
};
