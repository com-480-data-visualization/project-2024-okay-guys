document.addEventListener("DOMContentLoaded", function() {
    let SwimmerData = [];
    let animationSpeedFactor = 1; // Initial speed factor

    const margin = { top: 21, right: 20, bottom: 30, left: 20 };
    const width = 800 - margin.left - margin.right; // Updated width
    const height = 500 - margin.top - margin.bottom; // Updated height
    const circleRadius = 10; // Adjust circle radius as needed

    const container = d3.select("#container");

    const trackWidth = width; // Track width should match container width

    const trackSVG = container.append("svg")
        .attr("id", "pool-background")
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

    let numLanes = 8; // Default number of lanes
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
        svgContent.selectAll("line").remove(); // Clear existing lines
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

    function init() {
        svgContent.selectAll("circle")
            .data(SwimmerData)
            .enter()
            .append("circle")
            .attr("cx", 0) // Start at the beginning of x-axis
            .attr("cy", (d, i) => calculateLanePosition(d, i))
            .attr("r", circleRadius)
            .attr("fill", "grey");

        svgContent.selectAll("text.swimmer-name")
            .data(SwimmerData)
            .enter()
            .append("text")
            .attr("class", "swimmer-name")
            .attr("x", circleRadius + 5) // Adjust the distance from the circle
            .attr("y", (d, i) => calculateLanePosition(d, i))
            .attr("dy", "0.35em") // Center text vertically
            .attr("text-anchor", "start") // Align text to the start
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .text(d => d.swimmer);
    }

    function resetSVG() {
        // Remove existing SVG elements
        svgContent.selectAll("circle").remove();
        svgContent.selectAll("text.swimmer-name").remove();
        svgContent.selectAll("text.swimmer-time").remove();
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

    // Function to animate swimmers
    function animateSwimmers() {
        svgContent.selectAll("circle")
            .data(SwimmerData)
            .enter()
            .append("circle")
            .attr("cx", 0) // Start at the beginning of x-axis
            .attr("cy", (d, i) => calculateLanePosition(d, i))
            .attr("r", circleRadius)
            .attr("fill", "grey")
            .transition() // Apply transition to all circles (enter & update)
            .duration(d => d.time * 1000 * animationSpeedFactor) // Set duration based on time (in milliseconds)
            .ease(d3.easeLinear) // Adjust animation easing (optional)
            .attr("cx", trackWidth - margin.left - margin.right - circleRadius)  // Animate to final x position
            .on("end", function (d, i) {
                // Add text for displaying time at the end of the race
                svgContent.append("text")
                    .attr("class", "swimmer-time")
                    .attr("x", trackWidth - margin.left - margin.right - circleRadius - 15) // Adjust the distance from the circle
                    .attr("y", calculateLanePosition(d, i))
                    .attr("dy", "0.35em") // Center text vertically
                    .attr("text-anchor", "end") // Align text to the start
                    .attr("font-size", "12px")
                    .attr("fill", "black")
                    .attr("font-family", "sans-serif")
                    .text(d.time.toFixed(2) + "s"); // Display time in seconds
            });

        svgContent.selectAll("text.swimmer-name")
            .data(SwimmerData)
            .enter()
            .append("text")
            .attr("class", "swimmer-name")
            .attr("x", circleRadius + 5) // Adjust the distance from the circle
            .attr("y", (d, i) => calculateLanePosition(d, i))
            .attr("dy", "0.35em") // Center text vertically
            .attr("text-anchor", "start") // Align text to the start
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("font-family", "sans-serif")
            .text(d => d.swimmer)
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
                            swimmer: row.athlete_combined,
                            time: convertTimeToSeconds(row.performance_combined), // Extract time and convert to number
                            date: row.result_date
                        };
                    })

                console.log("Filtered and Converted Data:", SwimmerData);

                SwimmerData = SwimmerData
                    .filter(d => !isNaN(d.time) && d.time !== '' && d.time !== '-') // Filter out invalid performance metrics
                    .sort((a, b) => a.time - b.time); // Sort by performance

                console.log("Final Converted Data:", SwimmerData);

                // Shuffle the SwimmerData to randomize lane assignments
                SwimmerData = shuffleArray(SwimmerData);

                numLanes = SwimmerData.length;
                laneHeight = height / numLanes; // Recalculate lane height based on the number of swimmers

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
                    .filter(row => row.edition && row.edition.includes("Summer"))  // Ensure edition exists and contains "Summer"
                    .map(row => row.edition));

                const sortedEditions = Array.from(editionsSet).sort();
                const editionSelect = document.getElementById("edition-select");
                sortedEditions.forEach(edition => {
                    const option = document.createElement("option");
                    option.value = edition;
                    option.text = edition;
                    editionSelect.add(option);
                });

                editionSelect.addEventListener("change", function() {
                    const selectedEdition = editionSelect.value;
                    const eventSelect = document.getElementById("event-select");
                    eventSelect.innerHTML = ""; // Clear previous options

                    const eventSet = new Set();
                    parsedData.filter(row => row.sport === "Swimming" && row.edition === selectedEdition && row.event_title.includes("metres"))
                        .forEach(row => {
                            eventSet.add(row.event_title);
                        });

                    eventSet.forEach(event => {
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

    drawTrackBackground();
    drawTrack();
    populateDropdowns();

    document.getElementById("load-event").addEventListener("click", function () {
        const selectedEdition = document.getElementById("edition-select").value;
        const selectedEvent = document.getElementById("event-select").value;
        console.log("Selected Edition:", selectedEdition);
        console.log("Selected Event:", selectedEvent);
        loadEventData(selectedEvent, selectedEdition);
        const result_id = document.querySelector("#event-select option:checked").dataset.resultId;
        displaySource(result_id);
    });

    document.getElementById("speed-up").addEventListener("click", speedUp);
    document.getElementById("speed-down").addEventListener("click", speedDown);
    document.getElementById("play-button").addEventListener("click", resetAndStartAnimation);
});

function displaySource(result_id) {
    const sourceContainer = document.getElementById('sourceContainer');
    const sourceLink = `<a href="https://www.olympedia.org/results/${result_id}" target="_blank">Source</a>`;
  
    sourceContainer.innerHTML = `<p>${sourceLink}</p>`;
}
