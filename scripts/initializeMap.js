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
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", cityCoords.x);
    circleElement.setAttribute("cy", cityCoords.y);
    circleElement.setAttribute("r", "10");
    let fillColor;  // Variable pour stocker la couleur utilisée
    // Changer la couleur en fonction de l'événement olympique
    if (cityCoords.winter === 0) {
        fillColor = "orange";  // Jeux d'été
    } else {
        fillColor = "blue";    // Jeux d'hiver
    }
    circleElement.setAttribute("fill", fillColor);
    circleElement.setAttribute("data-name", cityCoords.name);
    circleElement.setAttribute("data-year", cityCoords.year);
    circleElement.setAttribute("data-country", cityCoords.country);
    console.log(`City: ${cityCoords.name}, Fill Color: ${fillColor}`);

    circleElement.addEventListener('click', (event) => {
      document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());
      
      let tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.left = `${event.pageX + 10}px`; // Décalage pour ne pas couvrir le curseur
      tooltip.style.top = `${event.pageY + 10}px`;
      tooltip.className = 'tooltip';
      
      // Créer des éléments span pour chaque partie du texte
      let cityCountrySpan = document.createElement('span');
      cityCountrySpan.className = 'city-country';
      cityCountrySpan.textContent = `${event.target.getAttribute('data-name')}, ${event.target.getAttribute('data-country')}`;
      
      let yearSpan = document.createElement('span');
      yearSpan.className = 'year';
      yearSpan.textContent = `${event.target.getAttribute('data-year')}`;
      
      // Ajouter les spans au tooltip
      tooltip.appendChild(cityCountrySpan);
      tooltip.appendChild(document.createElement('br')); // Saut de ligne
      tooltip.appendChild(yearSpan);
  
      document.body.appendChild(tooltip);
      setTimeout(() => { tooltip.classList.add('show'); }, 10); // Ajouter la classe 'show'
  });
  
  

    document.addEventListener('click', (event) => {
    if (!event.target.closest('circle')) {
        document.querySelectorAll('.tooltip').forEach(tooltip => {
            tooltip.classList.remove('show');
            setTimeout(() => { tooltip.remove(); }, 300); // Attendre que la transition soit terminée
        });
    }
});


    svgElement.appendChild(circleElement);
  }

  document.getElementById("mapContainer").appendChild(svgElement);
}

document.addEventListener("DOMContentLoaded", drawSVGPaths);
