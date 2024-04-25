function drawSVGPaths() {
  // Assurez-vous que simplemaps_worldmap_mapinfo est chargé
  if (!window.simplemaps_worldmap_mapinfo) {
      console.error("Map data is not loaded.");
      return;
  }
  const paths = window.simplemaps_worldmap_mapinfo.paths;
  const locations = window.simplemaps_worldmap_mapdata.locations;

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svgElement.setAttribute("viewBox", "0 0 2000 1000"); // Définir selon les besoins de votre carte
  svgElement.style.width = "100%";
  svgElement.style.height = "auto";

  for (const country in paths) {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", paths[country]);
      pathElement.setAttribute("fill", "#ccc"); // Changer la couleur au besoin
      pathElement.setAttribute("stroke", "black");
      pathElement.setAttribute("stroke-width", "2");
      svgElement.appendChild(pathElement);
  }

  for (const city in locations) {
    const cityCoords = locations[city];
    console.log("coucou");
    console.log(`${cityCoords.name}: (${cityCoords.x}, ${cityCoords.y})`);
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", cityCoords.x);
    circleElement.setAttribute("cy", cityCoords.y);
    circleElement.setAttribute("r", "5"); // Rayon du cercle
    circleElement.setAttribute("fill", "red");
    svgElement.appendChild(circleElement);
}


  document.getElementById("mapContainer").appendChild(svgElement);
}



document.addEventListener("DOMContentLoaded", drawSVGPaths);
