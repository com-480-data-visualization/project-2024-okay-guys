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
        
        console.log(RunnerData);
        
        const margin = { top: 21, right: 40, bottom: 30, left: 60 };
        const width = 900 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;
        const circleRadius = 10; // Adjust circle radius as needed

        const svg = d3.select("#race-viz")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleLinear()
        .domain([0,50])
        .range([0, width]);

        const numLanes = 8;
        const laneHeight = height / (numLanes + 1);
        const width_track = 600;

        for (let i = 1; i <= numLanes; i++) {
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", i * laneHeight)
            .attr("x2", width_track)
            .attr("y2", i * laneHeight)
            .attr("stroke", "gray")
            .attr("stroke-opacity", 0.2);
        }

        const calculateLanePosition = (d, i) => {
            const virtualLane = i % numLanes; 
            return laneHeight * (virtualLane + 0.5);
        };

        function init(){
            svg.selectAll("circle")
                .data(RunnerData.slice(split_bot_index,split_top_index))
                .enter()
                .append("circle")
                    .attr("cx", 0) // Start at the beginning of x-axis
                    .attr("cy", (d, i) => calculateLanePosition(d, i))
                    .attr("r", circleRadius)
                    .attr("fill", "blue");

            svg.selectAll("text.runner-name")
                .data(RunnerData.slice(split_bot_index,split_top_index))
                .enter()
                .append("text")
                    .attr("class", "runner-name")
                    .attr("x", circleRadius + 5) // Adjust the distance from the circle
                    .attr("y", (d, i) => calculateLanePosition(d, i))
                    .attr("dy", "0.35em") // Center text vertically
                    .attr("text-anchor", "start") // Align text to the start
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .text(d => d.runner);
        }

        init();

        function resetSVG() {
            // Remove existing SVG elements
            svg.selectAll("circle").remove();
            svg.selectAll("text.runner-name").remove();
            svg.selectAll("text.runner-time").remove();
        }


        let animationSpeedFactor = 1; // Initial speed factor

        // Function to increase the speed
        function speedUp() {
            animationSpeedFactor *= 0.5; // You can adjust the factor as needed
        }

        // Function to decrease the speed
        function speedDown() {
            animationSpeedFactor *= 2; // You can adjust the factor as needed
        }
        // Function to update the speed display
        function updateSpeedDisplay() {
            document.getElementById("speed-display").innerText = "Speed: x" + (1/animationSpeedFactor).toFixed(2);
        }

        document.getElementById("speed-up").addEventListener("click", speedUp);
        document.getElementById("speed-down").addEventListener("click", speedDown);
        document.getElementById("play-button").addEventListener("click", resetAndStartAnimation);
        updateSpeedDisplay();

        function resetAndStartAnimation() {
            resetSVG();
            updateSpeedDisplay();
            animaterunners();
        }

        // Function to animate runners
        function animaterunners() {
            svg.selectAll("circle")
                .data(RunnerData.slice(split_bot_index,split_top_index))
                .enter()
                .append("circle")
                    .attr("cx", 0) // Start at the beginning of x-axis
                    //.attr("cy", (d, i) => calculateLanePosition(d, i))
                    .attr("cy",(d,i) => calculateLanePosition(d, i))
                    .attr("r", circleRadius)
                    .attr("fill", "blue")
                .transition() // Apply transition to all circles (enter & update)
                    .duration(d => {
                        const duration = d.time * 1000 * animationSpeedFactor;
                        //console.log("Duration for d:", duration);
                        return duration;
                    }) // Set duration based on time (in milliseconds)
                    .ease(d3.easeLinear) // Adjust animation easing (optional)
                    .attr("cx", width_track)  // Animate to final x position
                    .on("start", function(d, i) {
                        //console.log("Transition started for d:", d);
                        //console.log("Index i:", i);
                    })
                    .on("end", function(d, i) {
                        //console.log("Transition ended for d:", d);
                        //console.log("Index i:", i);
                        // Add text for displaying time at the end of the race
                        svg.append("text")
                            .attr("class", "runner-time")
                            .attr("x", width_track - circleRadius - 15) // Adjust the distance from the circle
                            .attr("y", calculateLanePosition(d, i))
                            .attr("dy", "0.35em") // Center text vertically
                            .attr("text-anchor", "end") // Align text to the start
                            .attr("font-size", "12px")
                            .attr("fill", "black")
                            .attr("font-family", "sans-serif")
                            .text(d.time + "s"); // Display time in seconds
                    });
                

            svg.selectAll("text.runner-name")
                .data(RunnerData.slice(split_bot_index,split_top_index))
                .enter()
                .append("text")
                    .attr("class", "runner-name")
                    .attr("x", circleRadius + 5) // Adjust the distance from the circle
                    .attr("y", (d, i) => calculateLanePosition(d, i))
                    .attr("dy", "0.35em") // Center text vertically
                    .attr("text-anchor", "start") // Align text to the start
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .text(d => d.runner)
                .transition() // Apply transition to all text elements (enter & update)
                    .duration(d => d.time * 1000 * animationSpeedFactor) // Set duration based on time (in milliseconds)
                    .ease(d3.easeLinear) // Adjust animation easing (optional)
                    .attr("x", width_track + circleRadius + 10); // Animate to the end of x-axis
        }
    })
    .catch(error => console.error(error));  // Handle errors
});


    const margin = { top: 21, right: 40, bottom: 30, left: 60 };
    const width = 600;
    const height = 450 - margin.top - margin.bottom;

    const trackSVG = d3.select("#race-viz")
        .insert("svg", ":first-child") // Insert before the first child (your existing SVG)
        .attr("id", "track-background")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    // Add a rectangle representing the track
    trackSVG.append("rect")
        .attr("x", margin.left)  // Adjust the position based on margins
        .attr("y", margin.top)   // Adjust the position based on margins
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "brown"); // Adjust the fill color as needed

    // Position the track background behind the main SVG containing the runners
    trackSVG.style("position", "absolute")
        .style("z-index", -1); // Ensure the track background is behind other elements