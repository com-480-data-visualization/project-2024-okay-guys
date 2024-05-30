/**
 * Initializes and configures an interactive world map using SVG elements.
 * This script creates an SVG representation of the world map, draws paths and
 * locations based on provided data, and handles user interactions such as
 * mouse events and clicks. It also includes functions for displaying tooltips
 * and adjusting the map view.
 *
 * Functions:
 * - findRegionByCountry(country): Finds the region by country code.
 * - createSVGElement(): Creates and returns an SVG element for the map.
 * - drawSVGPaths(svgElement): Draws SVG paths and location circles on the map.
 * - createPathElement(dPath, country, region): Creates a path element for a country.
 * - showTooltip(type, event, data): Displays a tooltip based on the event and data.
 * - hideTooltip(): Hides all tooltips.
 * - handlePathMouseOverRegion(event): Handles mouse over events for regions.
 * - handlePathMouseOutRegion(): Handles mouse out events for regions.
 * - handlePathMouseOverCountry(event, path): Handles mouse over events for countries.
 * - handlePathMouseOutCountry(path): Handles mouse out events for countries.
 * - addPathEventListeners(path): Adds event listeners to a path element.
 * - handleRegionClick(region, svgElement): Handles click events for regions.
 * - displayPathsByRegion(selectedRegion, svgElement): Displays paths for a specific region.
 * - createCityElement(city, cityRegion): Creates a circle element for a city.
 * - calculateBoundingBox(region): Calculates the bounding box for a region.
 * - createLegend(svgElement): Creates a legend for the map.
 * - resetPathVisibility(svgElement): Resets visibility of all paths and circles.
 * - adjustSvgSize(): Adjusts the size of the SVG element based on the container size.
 *
 * Event Listeners:
 * - DOMContentLoaded: Initializes the map and sets up event listeners.
 * - window.resize: Adjusts the SVG size on window resize.
 * - backButton.click: Resets the map view to the default state.
 */

// Initial configuration and data retrieval from the map structure
const mapInfo = window.simplemaps_worldmap_mapinfo;
const { paths, defaultRegions, stateBboxArray } = mapInfo;
const locations = window.simplemaps_worldmap_mapdata.locations;
const countryNames = mapInfo.idToNames;

// Default styles
const defaultColor = '#ffffff';
const hoverColor = '#ccc';

// Convert country names to IDs
const countryIdsByName = Object.fromEntries(Object.entries(countryNames).map(([id, name]) => [name, id]));

// Find region by country
function findRegionByCountry(country) {
    return Object.entries(defaultRegions).find(([_, region]) => region.states.includes(country))?.[0];
}

// Create SVG element for the map
function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 2000 1000");
    svg.style.width = "80%";
    svg.style.height = "auto";
    svg.style.backgroundColor = "bfd7ea";
    return svg;
}

// Draw SVG paths on the map
function drawSVGPaths(svgElement) {
    Object.entries(paths).forEach(([country, dPath]) => {
        const region = findRegionByCountry(country);
        const pathElement = createPathElement(dPath, country, region);
        pathElement.addEventListener('click', () => handleRegionClick(region, svgElement));
        svgElement.appendChild(pathElement);
    });

    Object.values(locations).forEach(city => {
        const cityRegion = findRegionByCountry(countryIdsByName[city.country]);
        const circle = createCityElement(city, cityRegion);
        svgElement.appendChild(circle);
    });
}

// Create path element for the map
function createPathElement(dPath, country, region) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", dPath);
    path.setAttribute("fill", defaultColor);
    path.setAttribute("stroke", "black");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("id", country);
    path.setAttribute("data-region", region);
    addPathEventListeners(path);
    return path;
}

// Show tooltip
function showTooltip(type, event, data) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;

    let tooltipContent = '';
    switch (type) {
        case 'region':
            tooltipContent = `<span class='city-country'>${defaultRegions[data].name}</span>`;
            break;
        case 'country':
            tooltipContent = `<span class='city-country'>${countryNames[data]}</span>`;
            break;
        case 'city':
            tooltipContent = `<span class='city-country'>${data.name}, ${data.country}</span><br><span class='year'>${data.year}</span>`;
            tooltip.classList.add('city-tooltip');
            break;
        default:
            tooltipContent = '';
    }

    tooltip.innerHTML = tooltipContent;
    document.body.appendChild(tooltip);
    setTimeout(() => { tooltip.classList.add('show'); }, 10);
}

// Hide tooltip
function hideTooltip() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.classList.remove('show');
        setTimeout(() => { tooltip.remove(); }, 10);
    });
}

// Handle mouse over region
function handlePathMouseOverRegion(event) {
    const region = this.getAttribute('data-region');
    const paths = document.querySelectorAll(`path[data-region="${region}"]`);
    paths.forEach(path => {
        path.setAttribute('fill', hoverColor);
    });
    showTooltip('region', event, region);
}

// Handle mouse out region
function handlePathMouseOutRegion() {
    const region = this.getAttribute('data-region');
    const paths = document.querySelectorAll(`path[data-region="${region}"]`);
    paths.forEach(path => {
        path.setAttribute('fill', defaultColor);
    });
    hideTooltip();
}

// Handle mouse over country
function handlePathMouseOverCountry(event, path) {
    path.setAttribute('fill', hoverColor);
    showTooltip('country', event, path.getAttribute('id'));
}

// Handle mouse out country
function handlePathMouseOutCountry(path) {
    path.setAttribute('fill', defaultColor);
    hideTooltip();
}

// Add event listeners to path
function addPathEventListeners(path) {
    path.addEventListener('mouseover', handlePathMouseOverRegion);
    path.addEventListener('mouseout', handlePathMouseOutRegion);
}

// Handle region click
function handleRegionClick(region, svgElement) {
    const boundingBox = calculateBoundingBox(region);
    svgElement.setAttribute("viewBox", `${boundingBox.minX} ${boundingBox.minY} ${boundingBox.width} ${boundingBox.height}`);
    displayPathsByRegion(region, svgElement);
    adjustSvgSize();

    const backButton = document.getElementById('backButton');
    backButton.style.display = 'block';
}

// Display paths by region
function displayPathsByRegion(selectedRegion, svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        path.setAttribute('fill', defaultColor);
        path.removeEventListener('mouseover', handlePathMouseOverRegion);
        path.removeEventListener('mouseout', handlePathMouseOutRegion);
        path.addEventListener('mouseover', event => handlePathMouseOverCountry(event, path));
        path.addEventListener('mouseout', () => handlePathMouseOutCountry(path));

        if (path.getAttribute('data-region') === selectedRegion) {
            path.style.display = 'block';
        } else {
            path.style.display = 'none';
        }
    });

    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        if (circle.getAttribute('data-region') === selectedRegion) {
            circle.style.display = 'block';
            circle.setAttribute("r", "0.3vw");
        } else {
            circle.style.display = 'none';
        }
    });

    const legend = document.querySelector('.legend-container');
    legend.style.display = 'none';
}

// Create city element for the map
function createCityElement(city, cityRegion) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", city.x);
    circle.setAttribute("cy", city.y);
    circle.setAttribute("r", "7");
    circle.setAttribute("fill", city.winter === 0 ? "orange" : "blue");
    circle.setAttribute("data-region", cityRegion);
    circle.setAttribute("stroke", "black");
    circle.setAttribute("stroke-width", "2");
    circle.addEventListener('mouseover', event => showTooltip('city', event, city));
    circle.addEventListener('mouseout', hideTooltip);
    return circle;
}

// Calculate bounding box for the region
function calculateBoundingBox(region) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    Object.keys(stateBboxArray).forEach(country_id => {
        if (defaultRegions[region].states.includes(country_id)) {
            const bbox = stateBboxArray[country_id];
            minX = Math.min(minX, bbox.x);
            minY = Math.min(minY, bbox.y);
            maxX = Math.max(maxX, bbox.x2);
            maxY = Math.max(maxY, bbox.y2);
        }
    });
    return { minX, minY, width: maxX - minX, height: maxY - minY };
}

// Create legend for the map
function createLegend(svgElement) {
    const legendItems = [
        { fill: "orange", text: "Summer Olympics" },
        { fill: "blue", text: "Winter Olympics" }
    ];

    const legendContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    legendContainer.classList.add("legend-container");
    legendItems.forEach(({ fill, text }, index) => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.classList.add("legend-circle");
        circle.setAttribute("cx", 20);
        circle.setAttribute("cy", 20 + 40 * index);
        circle.setAttribute("r", "7");
        circle.setAttribute("fill", fill);

        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.classList.add("legend-text");
        textElement.setAttribute("x", 50);
        textElement.setAttribute("y", 40 + 40 * index);
        textElement.textContent = text;

        legendContainer.appendChild(circle);
        legendContainer.appendChild(textElement);
    });

    svgElement.appendChild(legendContainer);
}

// Initialize map on document load
document.addEventListener("DOMContentLoaded", () => {
    const svgElement = createSVGElement();
    document.getElementById("mapContainer").appendChild(svgElement);
    drawSVGPaths(svgElement);
    createLegend(svgElement);
    adjustSvgSize();

    window.addEventListener('resize', adjustSvgSize);

    const backButton = document.getElementById('backButton');
    // Handle click event for the back button
    backButton.addEventListener('click', () => {
        // Reset the viewBox to the default full view
        svgElement.setAttribute("viewBox", "0 0 2000 1000");
        // Reset the visibility of all paths
        resetPathVisibility(svgElement);
        // Adjust the size of the SVG element
        adjustSvgSize();
    });
});

// Reset path visibility to show all paths
function resetPathVisibility(svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        // Show all paths
        path.style.display = 'block';
        // Add event listeners to the paths
        addPathEventListeners(path);
    });
    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        // Show all circles
        circle.style.display = 'block';
        // Reset the radius of the circles
        circle.setAttribute("r", "7");
    });
    // Show the legend
    const legend = document.querySelector('.legend-container');
    legend.style.display = 'block';

    // Hide the back button
    const backButton = document.getElementById('backButton');
    backButton.style.display = 'none';
}

// Adjust the size of the SVG element based on the container size
function adjustSvgSize() {
    const container = document.getElementById('mapContainer');
    const svgElement = document.querySelector('#mapContainer svg');
    if (svgElement && container) {
        // Set the width of the SVG to 80% of the container width
        svgElement.style.width = '80%';
        // Set the height of the SVG to be half of the container's width
        svgElement.style.height = container.offsetWidth * 0.5 + 'px';
    }
}
    