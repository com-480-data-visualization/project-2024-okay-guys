

let data = [];


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

    const selectedYearSeason = document.getElementById('yearSeasonSelect').value;
    const [selectedYear, selectedSeason] = selectedYearSeason.split(" - ");
    console.log("chart data", data);


    let filteredData = data.filter(item => String(item.Year) === selectedYear && item.Season === selectedSeason);

    console.log(filteredData);


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
        window.myChart.destroy(); 
    }
    window.myChart = new Chart(ctx, {
        type: 'bar', 
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
            indexAxis: 'y',
            responsive: false,
            scales: {
                x: {
                    stacked: true,
                    beginAtZero: true,
                    title: {
                        display: true, 
                        text: 'Number of Medals'
                    },
                    ticks: {
                        stepSize: 1, 
                        precision: 0, 
                        callback: function(value) {
                            if (value % 1 === 0) {
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



window.onload = function() {
    Papa.parse("../data/medal_distribution.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            data = results.data;
            console.log(data);
            populateYears();
            updateChart(); 
        }
    })
};
