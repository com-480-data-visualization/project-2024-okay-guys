document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        d3.csv("../data/dataset_olympics.csv"),
        d3.json("../data/countries.geojson")
    ]).then(function(datasets) {
        const [data, world] = datasets;
        console.log("Datasets loaded:", datasets);

        const nocToCountry = {
            "GER": "DEU", "ALG": "DZA", "NCA": "NIC", "LBA": "LBY", "CHI": "CHL", "GUA": "GTM", "KSA": "SAU", "MTN": "MRT", "RSA": "ZAF", "ANG": "AGO", "NGR": "NGA",
            "NIG": "NER", "ZIM": "ZWE", "CGO": "COG", "CHA": "TCD", "POR": "PRT", "SUI": "CHE", "SUD": "SDN", "TAN": "TZA", "BUR": "BFA", "MAD": "MDG", "ZAM": "ZMB",
            "DEN": "DNK", "GRE": "GRC", "BOT": "BWA", "TOG": "TGO", "GBS": "GNB", "GUI": "GIN", "GEQ": "GNQ", "PAR": "PRY", "URU": "URY", "NCA": "NIC", "PHI": "PHL",
            "CRC": "CRI", "HON": "HND", "BIZ": "BLZ", "IRI": "IRN", "MGL": "MNG", "OMA": "OMN", "MYA": "MNR", "BAW": "BGD", "INA": "IDN", "MAS": "MYS", "MAW": "MWI",
            "SRI": "LKA", "BUL": "BGR", "LAT": "LVA", "NED": "NLD", "NEP": "NPL", "BAN": "BGD", "NCA": "NIC", "UAE": "ARE", "CAM": "KHM", "BHU": "BTN"
        };

        data.forEach(d => {
            d.Year = +d.Year;
            d.NOC = nocToCountry[d.NOC] || d.NOC;
        });

        const groupedDataByYear = d3.group(data, d => d.Year);
        const years = Array.from(groupedDataByYear.keys()).map(Number).sort((a, b) => a - b);
        console.log("Years:", years);

        const fourYearSteps = [];
        for (let year = 1896; year <= d3.max(years); year += 4) {
            if (year !== 1916 && year !== 1940 && year !== 1944) {
                fourYearSteps.push(year);
            }
        }
        fourYearSteps.push(1916, 1940, 1944);
        fourYearSteps.sort((a, b) => a - b);

        const width = window.innerWidth * 0.90;
        const height = window.innerHeight * 0.8;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const projection = d3.geoMercator()
            .scale(220)
            .translate([width / 1.9, height / 1.55]);

        const path = d3.geoPath().projection(projection);

        const color = d3.scaleSequential(d3.interpolateViridis)
            .domain([1, 0]);

        const legend = svg.append("g")
            .attr("class", "legendSequential")
            .attr("transform", `translate(${width * 0.05}, 450)`); 

        const legendSequential = d3.legendColor()
            .shapeWidth(80)
            .cells(10)
            .orient("vertical")
            .scale(color);

        legend.call(legendSequential);

        legend.append("text")
            .attr("x", -35)
            .attr("y", -40)
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .text("Same Amount of Female");

        legend.append("text")
            .attr("x", -20)
            .attr("y", -20)
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .text("and Male Athletes");

        legend.append("text")
            .attr("x", -19)
            .attr("y", 245)
            .style("text-anchor", "start")
            .style("font-weight", "bold")
            .text("100% Male Athletes");

        function update(year) {
            console.log("Updating year:", year);
            svg.selectAll("path").remove();
            svg.selectAll("rect.background").remove();
            svg.selectAll("text.message").remove();

            if (year === 1916 || year === 1940 || year === 1944) {
                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "#d3d3d3")
                    .attr("class", "background");

                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "40px")
                    .style("font-weight", "bold")
                    .text(year === 1916 ? "No Olympic Games held during World War I" : "No Olympic Games held during World War II")
                    .attr("class", "message");
                return;
            }

            const yearData = groupedDataByYear.get(year) || [];
            const nestedData = d3.groups(yearData, d => d.NOC)
                .map(([key, values]) => ({
                    country: key,
                    female: values.filter(d => d.Sex === 'F').length,
                    male: values.filter(d => d.Sex === 'M').length
                }))
                .map(d => ({
                    country: d.country,
                    ratio: d.male + d.female === 0 ? undefined : d.female / (d.male + d.female)
                }));
            console.log("Nested data for year " + year + ":", nestedData);

            const countryRatioMap = new Map(nestedData.map(d => [d.country, d.ratio]));

            svg.selectAll("path")
                .data(world.features)
                .enter().append("path")
                .attr("d", path)
                .attr("fill", d => {
                    const ratio = countryRatioMap.get(d.properties.ISO_A3);
                    if (d.properties.ISO_A3 === "GRL") {
                        return countryRatioMap.get("DNK") === undefined ? "#d3d3d3" : color(countryRatioMap.get("DNK"));
                    }
                    return ratio === undefined ? "#d3d3d3" : color(ratio);
                })
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5);
        }

        const slider = d3.select("#yearSlider")
            .attr("min", 1896)
            .attr("max", d3.max(fourYearSteps))
            .attr("step", 4)
            .style("width", width + "px")
            .style("margin", "10px 0")
            .on("input", function() {
                update(+this.value);
                d3.select("#yearDisplay").html("<b>" + this.value + "</b>");
            });

        slider.property("value", 1896);
        d3.select("#yearDisplay").html("<b>" + 1896 + "</b>");
        update(1896);

        let interval;
        d3.select("#playButton").on("click", function() {
            if (interval) {
                clearInterval(interval);
                interval = null;
                d3.select(this).text("Play");
            } else {
                d3.select(this).text("Pause");
                let currentYearIndex = fourYearSteps.indexOf(+slider.property("value"));
                interval = setInterval(function() {
                    currentYearIndex = (currentYearIndex + 1) % fourYearSteps.length;
                    const currentYear = fourYearSteps[currentYearIndex];
                    slider.property("value", currentYear);
                    update(currentYear);
                    d3.select("#yearDisplay").html("<b>" + currentYear + "</b>");
                }, 1500);
            }
        });
    }).catch(function(error) {
        console.error("Error loading the data files:", error);
    });
});


