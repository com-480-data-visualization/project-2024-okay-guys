document.addEventListener("DOMContentLoaded", function() {
    d3.csv("../data/dataset_olympics.csv").then(function(data) {
        console.log("CSV data loaded:", data);

        data.forEach(d => {
            d.Year = +d.Year;
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

        console.log("Four year steps:", fourYearSteps);

        const width = window.innerWidth * 0.9;
        const height = window.innerHeight * 0.85;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const treemap = d3.treemap()
            .size([width, height])
            .padding(1)
            .round(true);

        const color = d3.scaleOrdinal(d3.schemeCategory10); 

        function update(year) {
            console.log("Updating year:", year);
            svg.selectAll("*").remove();

            if (year === 1916 || year === 1940 || year === 1944) {
                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("fill", "#d3d3d3"); 

                svg.append("text")
                    .attr("x", width / 2)
                    .attr("y", height / 2)
                    .attr("text-anchor", "middle")
                    .style("font-size", "24px")
                    .style("font-weight", "bold")
                    .text(year === 1916 ? "No Olympic Games held during World War I" : "No Olympic Games held during World War II");
                return;
            }

            const yearData = groupedDataByYear.get(year) || [];
            const filteredData = yearData.filter(d => d.Sport); 
            console.log("Filtered data for year " + year + ":", filteredData);

            const nestedData = d3.groups(filteredData, d => d.Sport)
                .map(([key, values]) => ({
                    name: key || "Unknown",
                    value: values.length 
                }));
            console.log("Nested data for year " + year + ":", nestedData);

            const root = d3.hierarchy({ children: nestedData })
                .sum(d => d.value)
                .sort((a, b) => b.value - a.value);

            treemap(root);

            const nodes = svg.selectAll("g")
                .data(root.leaves(), d => d.data.name);

            const nodesEnter = nodes.enter().append("g")
                .attr("transform", d => `translate(${d.x0},${d.y0})`);

            nodesEnter.append("rect")
                .attr("id", d => d.data.name)
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => color(d.data.name));

            nodesEnter.append("text")
                .attr("x", d => (d.x1 - d.x0) * 0.02) 
                .attr("y", d => (d.y1 - d.y0) * 0.15) 
                .style("font-weight", "bold")
                .text(d => `${d.data.name}`)
                .style("font-size", d => `${Math.min((d.x1 - d.x0) * 0.15, (d.y1 - d.y0) * 0.15)}px`); 

            nodesEnter.append("text")
                .attr("x", d => (d.x1 - d.x0) / 2)
                .attr("y", d => (d.y1 - d.y0) / 2)
                .attr("text-anchor", "middle")
                .style("font-size", d => `${Math.min((d.x1 - d.x0) * 0.2, (d.y1 - d.y0) * 0.2)}px`) 
                .text(d => `${d.data.value}`);

            nodes.merge(nodesEnter)
                .transition()
                .attr("transform", d => `translate(${d.x0},${d.y0})`);
            
            nodes.select("rect")
                .transition()
                .attr("width", d => d.x1 - d.x0)
                .attr("height", d => d.y1 - d.y0)
                .attr("fill", d => color(d.data.name));
            
            nodes.select("text")
                .transition()
                .attr("x", d => (d.x1 - d.x0) * 0.03)
                .attr("y", d => (d.y1 - d.y0) * 0.15) 
                .style("font-weight", "bold")
                .style("font-size", d => `${Math.min((d.x1 - d.x0) * 0.15, (d.y1 - d.y0) * 0.15)}px`); 
            
            nodes.select("text")
                .transition()
                .attr("x", d => (d.x1 - d.x0) / 2) 
                .attr("y", d => (d.y1 - d.y0) / 2) 
                .attr("text-anchor", "middle")
                .style("font-size", d => `${Math.min((d.x1 - d.x0) * 0.2, (d.y1 - d.y0) * 0.2)}px`)
                .text(d => `${d.data.value}`);

            nodes.exit().remove();
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
        console.error("Error loading the CSV file:", error);
    });
});

