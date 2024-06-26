document.addEventListener("DOMContentLoaded", function() {
    let SwimmerData = [];
    let animationSpeedFactor = 1; // Initial speed factor
    let nocToIso = {}; // Store the NOC to ISO mapping

    const margin = { top: 21, right: 20, bottom: 30, left: 20 };
    const width = 800 - margin.left - margin.right; // Updated width
    const height = 500 - margin.top - margin.bottom; // Updated height
    const circleRadius = 10; // Adjust circle radius as needed

    const container = d3.select("#container");

    const trackWidth = width; // Track width should match container width

    const trackSVG = container.append("svg")
        .attr("id", "track-background")
        .attr("width", trackWidth)
        .attr("height", height + margin.top + margin.bottom) // Ensure full height including margins
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .style("z-index", -1);

    const svg = container.append("svg")
        .attr("id", "race-viz")
        .attr("width", trackWidth)
        .attr("height", height + margin.top + margin.bottom) // Ensure full height including margins
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0);

    const svgContent = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);



    numLanes = 8;
    let laneHeight = height / numLanes; // Calculate lane height

    function drawTrackBackground() {
        trackSVG.append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", trackWidth - margin.left - margin.right)
            .attr("height", height)
            .attr("fill", "lightblue");
    }

    function drawTrack() {
        svgContent.selectAll("line").remove(); 
        for (let i = 1; i <= numLanes; i++) {
            svgContent.append("line")
                .attr("x1", 0)
                .attr("y1", i * laneHeight)
                .attr("x2", trackWidth - margin.left - margin.right)
                .attr("y2", i * laneHeight)
                .attr("stroke", "black")
                .attr("stroke-opacity", 0.2);
        }
    }

    function calculateLanePosition(d, i) {
        return laneHeight * (i + 0.5);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }


    function formatTime(seconds) {
        if (seconds >= 60) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = (seconds % 60).toFixed(3);
            return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
        } else {
            return seconds.toFixed(2) + "s";
        }
    }

    function init() {
        // Append Swimmer names and measure their widths
        const SwimmerText = svgContent.selectAll("text.Swimmer-name")
            .data(SwimmerData)
            .enter()
            .append("text")
            .attr("class", "Swimmer-name")
            .attr("x", circleRadius + 5) // Adjust the distance from the circle
            .attr("y", (d, i) => calculateLanePosition(d, i))
            .attr("dy", "0.35em") // Center text vertically
            .attr("text-anchor", "start") // Align text to the start
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .text(d => d.Swimmer)
            .each(function(d) {
                const bbox = this.getBBox();
                d.textWidth = bbox.width;
            });

        // Append circles for Swimmers
        svgContent.selectAll("circle")
            .data(SwimmerData)
            .enter()
            .append("circle")
            .attr("cx", 0) // Start at the beginning of x-axis
            .attr("cy", (d, i) => calculateLanePosition(d, i))
            .attr("r", circleRadius)
            .attr("fill", "blue");

        // Display flags at the start based on the measured width of the Swimmer names
        svgContent.selectAll("image.flag-start")
            .data(SwimmerData)
            .enter()
            .append("image")
            .attr("class", "flag-start")
            .attr("x", d => circleRadius + 10 + d.textWidth) // Position the flag after the text width
            .attr("y", (d, i) => calculateLanePosition(d, i) - 12) // Adjust Y position to align with the Swimmer
            .attr("width", 32)
            .attr("height", 24)
            .attr("xlink:href", d => `https://flagcdn.com/32x24/${nocToIso[d.noc] || d.noc.toLowerCase()}.png`);
    }


    function resetSVG() {
        // Remove existing SVG elements
        svgContent.selectAll("circle").remove();
        svgContent.selectAll("text.Swimmer-name").remove();
        svgContent.selectAll("text.Swimmer-time").remove();
        svgContent.selectAll("text.Swimmer-rank").remove();
        svgContent.selectAll("image.flag-end").remove();
        svgContent.selectAll("text.swimmer-record").remove();
    }


    // Function to increase the speed
    function speedUp() {
        animationSpeedFactor *= 0.5; // You can adjust the factor as needed
        updateSpeedDisplay();
    }

    // Function to decrease the speed
    function speedDown() {
        animationSpeedFactor *= 2; // You can adjust the factor as needed
        updateSpeedDisplay();
    }

    // Function to update the speed display
    function updateSpeedDisplay() {
        document.getElementById("speed-display").innerText = "Speed: x" + (1 / animationSpeedFactor).toFixed(2);
    }

    function resetAndStartAnimation() {
        resetSVG();
        updateSpeedDisplay();
        animateSwimmers();
    }

    function convertTimeToSeconds(timeString) {
        // Remove position in parentheses if present
        const cleanTimeString = timeString.split(" ")[0];
        // Check if time is in the format "MM:SS.sss"
        const minuteSecondPattern = /^(\d+):(\d+\.\d+)$/;
        const secondPattern = /^(\d+\.\d+)$/;

        if (minuteSecondPattern.test(cleanTimeString)) {
            const match = minuteSecondPattern.exec(cleanTimeString);
            const minutes = parseFloat(match[1]);
            const seconds = parseFloat(match[2]);
            return (minutes * 60) + seconds;
        } else if (secondPattern.test(cleanTimeString)) {
            return parseFloat(cleanTimeString);
        } else {
            return NaN;
        }
    }


    function animateSwimmers() {
        // Fade out the flags at the start
        svgContent.selectAll("image.flag-start")
            .transition()
            .duration(100)
            .style("opacity", 0)
            .remove();

        // Sort the Swimmers based on their times to determine the ranking
        const rankedSwimmers = [...SwimmerData].sort((a, b) => a.time - b.time);
        rankedSwimmers.forEach((d, i) => d.rank = i + 1);

        const circles = svgContent.selectAll("circle")
            .data(SwimmerData)
            .enter()
            .append("circle")
            .attr("cx", 0) // Start at the beginning of x-axis
            .attr("cy", (d, i) => calculateLanePosition(d, i))
            .attr("r", circleRadius)
            .attr("fill", "blue");

        circles.transition() // Apply transition to all circles (enter & update)
            .duration(d => d.time * 1000 * animationSpeedFactor) // Set duration based on time (in milliseconds)
            .ease(d3.easeLinear) // Adjust animation easing (optional)
            .attr("cx", trackWidth - margin.left - margin.right - circleRadius)  // Animate to final x position
            .on("end", function (d, i) {
                // Add text for displaying time at the end of the race
                svgContent.append("text")
                    .attr("class", "Swimmer-time")
                    .attr("x", trackWidth - margin.left - margin.right - circleRadius - 15) // Adjust the distance from the circle
                    .attr("y", calculateLanePosition(d, i))
                    .attr("dy", "0.35em") // Center text vertically
                    .attr("text-anchor", "end") // Align text to the start
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .text(formatTime(d.time)); // Display time in seconds

                // Add text for displaying the rank inside the lane
                svgContent.append("text")
                    .attr("class", "Swimmer-rank")
                    .attr("x", trackWidth - margin.left - margin.right - circleRadius - 70) // Adjust the distance from the circle
                    .attr("y", calculateLanePosition(d, i))
                    .attr("dy", "0.35em") // Center text vertically
                    .attr("text-anchor", "end") // Align text to the end
                    .attr("font-size", "12px")
                    .attr("fill", "red")
                    .attr("font-family", "sans-serif")
                    .text("Rank: " + d.rank); // Display the rank

                // Display flags at the end
                svgContent.append("image")
                    .attr("class", "flag-end")
                    .attr("x", trackWidth - margin.left - margin.right - 170) // Position the flag to the right of the ending point
                    .attr("y", calculateLanePosition(d, i) - 12) // Adjust Y position to align with the Swimmer
                    .attr("width", 32)
                    .attr("height", 24)
                    .attr("xlink:href", `https://flagcdn.com/32x24/${nocToIso[d.noc] || d.noc.toLowerCase()}.png`);

                    if (d.time < previousRecord.time) {
                        svgContent.append("text")
                            .attr("class", "swimmer-record")
                            .attr("x", trackWidth - margin.left - margin.right - circleRadius - 180) // Adjust the distance from the circle
                            .attr("y", calculateLanePosition(d, i))
                            .attr("dy", "0.35em") // Center text vertically
                            .attr("text-anchor", "end") // Align text to the start
                            .attr("font-size", "14px")
                            .attr("fill", "yellow")
                            .attr("font-family", "sans-serif")
                            .text("New Record!"); 
                    }
            });

        svgContent.selectAll("text.Swimmer-name")
            .data(SwimmerData)
            .enter()
            .append("text")
            .attr("class", "Swimmer-name")
            .attr("x", circleRadius + 5) // Adjust the distance from the circle
            .attr("y", (d, i) => calculateLanePosition(d, i))
            .attr("dy", "0.35em") // Center text vertically
            .attr("text-anchor", "start") // Align text to the start
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .text(d => d.Swimmer)
            .transition() // Apply transition to all text elements (enter & update)
            .duration(d => d.time * 1000 * animationSpeedFactor) // Set duration based on time (in milliseconds)
            .ease(d3.easeLinear) // Adjust animation easing (optional)
            .attr("x", trackWidth + circleRadius - margin.left - margin.right + 5); // Animate to the end of x-axis
    }

    function loadEventData(eventTitle, edition) {
        fetch('../data/data.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData = Papa.parse(csvData, { header: true }).data;

                SwimmerData = parsedData
                    .filter(row => row.event_title === eventTitle && row.sport === "Swimming" && row.edition === edition)
                    .map(row => {
                        return {
                            Swimmer: row.athlete_combined,
                            time: convertTimeToSeconds(row.performance_combined),// Extract time and convert to number
                            date: row.result_date,
                            noc: row.noc
                        };
                    })
                    .filter(d => !isNaN(d.time) && d.time !== '' && d.time !== '-') // Filter out invalid performance metrics
                    .sort((a, b) => a.time - b.time); // Sort by performance

                SwimmerData = shuffleArray(SwimmerData);
                numLanes = SwimmerData.length;
                laneHeight = height / numLanes; // Recalculate lane height based on the number of Swimmers

                if (SwimmerData.length > 0) {
                    document.getElementById("play-button").disabled = false;
                    document.getElementById("speed-up").disabled = false;
                    document.getElementById("speed-down").disabled = false;
                    drawTrack();
                    resetSVG();
                    init();
                } else {
                    alert("No data found for the selected event.");
                }
                
                // Get the current edition year
                const currentEditionYear = parseInt(edition.split(" ")[0]);
    
                // Find and display previous record for similar events in past editions
                previousRecord = parsedData
                    .filter(row => row.event_title === eventTitle && row.sport === "Swimming" && parseInt(row.edition.split(" ")[0]) < currentEditionYear)
                    .reduce((prev, current) => {
                        const currentTime = convertTimeToSeconds(current.performance_combined);
                        if (!isNaN(currentTime) && (prev === null || currentTime < prev.time)) {
                            return {
                                time: currentTime,
                                edition: current.edition,
                                swimmer: current.athlete_combined
                            };
                        }
                        return prev;
                    }, null);
    
                const recordDisplay = document.getElementById("record-display");
                if (previousRecord) {
                    recordDisplay.innerHTML = `<p>Previous Olympic Record: ${previousRecord.swimmer} (${previousRecord.edition}) - ${formatTime(previousRecord.time)}</p>`;
                } else {
                    recordDisplay.innerHTML = "<p>This is the first time the event occurs.</p>";
                }
    
            })
            .catch(error => console.error(error)); // Handle errors
    }

    function populateDropdowns() {
        fetch('../data/data.csv')
            .then(response => response.text())
            .then(csvData => {
                const parsedData = Papa.parse(csvData, { header: true }).data;
    
                // Populate editions dropdown
                const editionsSet = new Set(parsedData
                    .filter(row => row.edition && row.edition.includes("Summer"))
                    .map(row => row.edition));
    
                const sortedEditions = Array.from(editionsSet).sort();
                const editionSelect = document.getElementById("edition-select");
                sortedEditions.forEach(edition => {
                    const option = document.createElement("option");
                    option.value = edition;
                    option.text = edition;
                    editionSelect.add(option);
                });
    
                // Populate events dropdown based on selected edition
                editionSelect.addEventListener("change", function() {
                    const selectedEdition = editionSelect.value;
                    const eventSet = new Set(parsedData
                        .filter(row => row.sport === "Swimming" && row.edition === selectedEdition && (row.event_title.includes("metres")))
                        .map(row => row.event_title));
                    
                    const sortedEvents = Array.from(eventSet).sort(); // Sort events alphabetically
                    const eventSelect = document.getElementById("event-select");
                    eventSelect.innerHTML = ""; // Clear previous options
                    
                    sortedEvents.forEach(event => {
                        const option = document.createElement("option");
                        option.value = event;
                        option.text = event;
                        option.dataset.resultId = parsedData.find(row => row.event_title === event && row.edition === selectedEdition).result_id;
                        eventSelect.add(option);
                    });
                });
    
                // Trigger change event to populate events for the first edition
                editionSelect.dispatchEvent(new Event("change"));
            })
            .catch(error => console.error(error)); // Handle errors
    }

    drawTrackBackground(); // Draw track background as soon as the page loads
    drawTrack(); // Draw the track lanes as soon as the page loads
    populateDropdowns(); // Populate the dropdowns with data from CSV

    document.getElementById("load-event").addEventListener("click", function () {
        const selectedEdition = document.getElementById("edition-select").value;
        const selectedEvent = document.getElementById("event-select").value;
        console.log("Selected Edition:", selectedEdition);
        console.log("Selected Event:", selectedEvent);
        loadEventData(selectedEvent, selectedEdition);
            // Get the result_id value from the selected event option
        const result_id = document.querySelector("#event-select option:checked").dataset.resultId;
        displaySource(result_id);  // Call displaySource with the result_id
    });

    document.getElementById("speed-up").addEventListener("click", speedUp);
    document.getElementById("speed-down").addEventListener("click", speedDown);
    document.getElementById("play-button").addEventListener("click", resetAndStartAnimation);
        // Fetch the NOC to ISO mapping JSON
    fetch('../data/noc_to_iso_mapping.json')
        .then(response => response.json())
        .then(data => {
            nocToIso = data;
        })
        .catch(error => console.error('Error loading NOC to ISO mapping:', error));
});

function displaySource(result_id) {
    const sourceContainer = document.getElementById('sourceContainer');
    const sourceLink = `<a href="https://www.olympedia.org/results/${result_id}" target="_blank">Source</a>`;
  
    sourceContainer.innerHTML = `<p>${sourceLink}</p>`;
}