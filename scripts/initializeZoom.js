const regionColors = {
    "0": "#FFCCCC", // North America
    "1": "#CCFFCC", // South America
    "2": "#CCCCFF", // Europe
    "3": "#FFFFCC", // Africa and the Middle East
    "4": "#FFCCFF", // South Asia
    "5": "#CCFFFF"  // North Asia
  };

function drawCountries() {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", "0 0 2000 1000");
    svgElement.style.width = "100%";
    svgElement.style.height = "auto";
    Object.keys(simplemaps_worldmap_mapinfo.paths).forEach(countryId => {
        const pathData = simplemaps_worldmap_mapinfo.paths[countryId];
        const regionId = getRegionIdByCountry(countryId);
        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathData);
        pathElement.setAttribute("fill", regionColors[regionId] || "#DDD"); // Default grey if no region
        pathElement.setAttribute("stroke", "black"); // White border for better separation
        pathElement.setAttribute("id", countryId);
        pathElement.addEventListener('click', () => filterByRegion(regionId));
        svgElement.appendChild(pathElement);

        console.log(pathElement);

    });

    document.getElementById("mapContainer").appendChild(svgElement);
}

function getRegionIdByCountry(countryId) {
    const default_regions =  window.simplemaps_worldmap_mapinfo.default_regions;
    return Object.keys(default_regions).find(regionId =>
      default_regions[regionId].states.includes(countryId)
    );
  }


  document.addEventListener("DOMContentLoaded", function() {
    drawCountries();
});
