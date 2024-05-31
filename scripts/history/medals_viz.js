document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        d3.csv("../data/medal_distribution.csv")
    ]).then(function(datasets) {
        const [data] = datasets;

        const otherEurope = [
            "Austria", "Belgium", "Bulgaria", "Czech Republic", "Denmark", "Finland", "Greece", "Hungary", "Ireland", "Netherlands", 
            "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Spain", "Sweden", "Ukraine", "Moldova", "Monaco", "Montenegro", 
            "North Macedonia", "Serbia", "Slovenia", "Albania", "Andorra", "Armenia", "Azerbaijan", "Belarus", "Bosnia and Herzegovina", 
            "Croatia", "Cyprus", "Estonia", "Georgia", "Iceland", "Kosovo", "Latvia", "Lithuania", "Luxembourg", "Malta", "San Marino"
        ];

        const Asia = [
            "China", "India", "Japan", "South Korea", "Malaysia", "Mongolia", "Nepal", "Pakistan", "Philippines", "Singapore", 
            "Sri Lanka", "Thailand", "Vietnam", "Afghanistan", "Bahrain", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "Indonesia", 
            "Iran", "Iraq", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Maldives", "Myanmar", "North Korea", 
            "Oman", "Qatar", "Saudi Arabia", "Syria", "Tajikistan", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Yemen"
        ];

        const CanadaMexico = [
            "Canada", "Mexico", "Bahamas", "Barbados", "Cuba", "Dominican Republic", "Haiti", "Jamaica", "Puerto Rico", 
            "Trinidad and Tobago", "Antigua", "Belize", "Bermuda", "Cayman Islands", "Dominica", "Grenada", "Saint Kitts", "Saint Lucia", 
            "Saint Vincent", "Saint Vincent and the Grenadines"
        ];

        const SouthAmerica = [
            "Argentina", "Brazil", "Bolivia", "Chile", "Colombia", "Ecuador", "Paraguay", "Peru", "Uruguay", "Venezuela", 
            "Guyana", "Suriname"
        ];

        const Africa = [
            "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cape Verde", "Cameroon", "Central African Republic", 
            "Chad", "Comoros", "Congo", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", 
            "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", 
            "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", 
            "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", 
            "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe"
        ];
        data.forEach(d => {
            d.Year = +d.Year;
            d.Gold = +d.Gold || 0;
            d.Silver = +d.Silver || 0;
            d.Bronze = +d.Bronze || 0;
        });

        const nestedData = d3.group(data, d => d.Year);
        const years = Array.from(nestedData.keys()).filter(year => year % 4 === 0 && year >= 1886 && year <= 2016);
        console.log("Years:", years);


        const processedData = years.map(year => {
            const yearData = nestedData.get(year) || [];
            const groupedData = {
                "United States of America": 0,
                "Russia": 0,
                "Germany": 0,
                "Australia": 0,
                "France": 0,
                "Switzerland": 0,
                "Other Europe": 0,
                "Asia": 0,
                "Canada & Mexico": 0,
                "South America": 0,
                "Africa": 0
            };

            yearData.forEach(d => {
                const totalMedals = d.Gold + d.Silver + d.Bronze;
                if (groupedData.hasOwnProperty(d.Country)) {
                    groupedData[d.Country] += totalMedals;
                } else if (otherEurope.includes(d.Country)) {
                    groupedData["Other Europe"] += totalMedals;
                } else if (Asia.includes(d.Country)) {
                    groupedData["Asia"] += totalMedals;
                } else if (CanadaMexico.includes(d.Country)) {
                    groupedData["Canada & Mexico"] += totalMedals;
                } else if (SouthAmerica.includes(d.Country)) {
                    groupedData["South America"] += totalMedals;
                } else if (Africa.includes(d.Country)) {
                    groupedData["Africa"] += totalMedals;
                }
            });

            return { year, ...groupedData };
        });

        console.log("Processed Data:", processedData);

        const width = window.innerWidth * 0.9;
        const height = window.innerHeight * 0.9;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

            const x = d3.scaleLinear()
            .domain([1886, 2018]) 
            .range([50, width - 50]); 

        const y = d3.scaleLinear()
            .domain([0, d3.max(processedData, d => d3.sum(Object.values(d).slice(1)))])
            .range([height / 2, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const stack = d3.stack()
            .keys(Object.keys(processedData[0]).slice(1))
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetSilhouette); 

        const area = d3.area()
            .x(d => x(d.data.year))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        const series = stack(processedData);
        
        svg.selectAll(".layer")
            .data(series)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", area)
            .style("fill", d => color(d.key));

        const tickYears = d3.range(1896, 2020, 4); 

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${height / 2})`)
            .call(d3.axisBottom(x).tickValues(tickYears).tickFormat(d3.format("d")).tickSize(10).tickPadding(5))
            .selectAll("text")
            .style("font-size", "14px") 
            .style("font-weight", "bold"); 
        
        svg.select(".x.axis path")
            .style("stroke-width", "2px"); 

        svg.selectAll(".y.axis").remove();

        const legend = svg.append("g")
            .attr("transform", "translate(50, 50)");

        legend.selectAll("rect")
            .data(series)
            .enter().append("rect")
            .attr("x", (d, i) => (i % 6) * 240) 
            .attr("y", (d, i) => Math.floor(i / 6) * 30) 
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", d => color(d.key));

        legend.selectAll("text")
            .data(series)
            .enter().append("text")
            .attr("x", (d, i) => (i % 6) * 240 + 20) 
            .attr("y", (d, i) => Math.floor(i / 6) * 30 + 9)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text(d => d.key);

        const chart = svg.select("#chart svg")
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet");

        const legendNode = legend.node();
        if (legendNode) {
            const legendWidth = legendNode.getBBox().width;
            const legendHeight = legendNode.getBBox().height;
            legend.attr("transform", `translate(${(width - legendWidth) / 2}, 50)`);
        }
    }).catch(function(error) {
        console.error("Error loading the data files:", error);
    });
});