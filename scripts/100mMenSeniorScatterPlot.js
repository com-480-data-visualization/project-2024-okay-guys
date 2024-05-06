document.addEventListener("DOMContentLoaded", function() {
    fetch('/data/athletics/outdoor_senior_men_world_records.csv')
      .then(response => response.text())
      .then(csvData => {
        // Parse the CSV data using Papa Parse
        const parsedData = Papa.parse(csvData).data;

        const headerRow = parsedData[0];
        const nameIndex = headerRow.indexOf("competitor");
        const timeIndex = headerRow.indexOf("mark");
        const dateIndex = headerRow.indexOf("date");
        const split_bot_index = 9;
        const split_top_index = 17;

        const RunnerData = parsedData.slice(1).map((row, i) => {
            return {
              runner: row[nameIndex],
              time: +row[timeIndex], // Convert time to number
              date: row[dateIndex]
            };
          });

        // Your D3.js code to generate the chart here
        const width = 928;
        const height = 720;
        const marginTop = 20;
        const marginRight = 30;
        const marginBottom = 30;
        const marginLeft = 40;

        // Declare the positional encodings.
        const x = d3.scaleTime()
            .domain(d3.extent(RunnerData, d => new Date(d.date))) // Assuming date is in a proper format
            .nice()
            .range([marginLeft, width - marginRight]);

        const y = d3.scaleLinear()
            .domain(d3.extent(RunnerData, d => d.time)).nice()
            .range([height - marginBottom, marginTop]);

        const line = d3.line()
            .curve(d3.curveCatmullRom)
            .x(d => x(new Date(d.date)))
            .y(d => y(d.time));

        const svg = d3.select("#chart-container").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto;");

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x))
          .append("text")
            .attr("x", width - 4)
            .attr("y", -4)
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .attr("fill", "currentColor")
            .text("Date");

        svg.append("g")
            .attr("transform", `translate(${marginLeft},0)`)
            .call(d3.axisLeft(y))
          .append("text")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("fill", "#000")
            .text("Time (seconds)");

        svg.append("path")
            .datum(RunnerData)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

        // Append circles for data points
        svg.selectAll("circle")
            .data(RunnerData)
            .enter().append("circle")
            .attr("cx", d => x(new Date(d.date)))
            .attr("cy", d => y(d.time))
            .attr("r", 5) // Increase the size for better interaction
            .attr("fill", "steelblue")
            .on("mouseover", function(event, d) {
                // Show tooltip on mouseover
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(`<strong>${d.runner}</strong><br>Year: ${d.date}<br>Performance: ${d.time} s`)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
                // Hide tooltip on mouseout
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        // Append a tooltip element
        const tooltip = d3.select("#chart-container").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "1px solid #ddd")
            .style("padding", "5px");




      })
    .catch(error => console.error(error));
});
