const regionColors = {
  "North America": "#a1caf1", // Couleur pour l'Amérique du Nord
  "South America": "#f4c2c2", // Couleur pour l'Amérique du Sud
  "Europe": "#fbe7a1", // Couleur pour l'Europe
  "Africa and the Middle East": "#b2beb5", // Couleur pour l'Afrique et le Moyen-Orient
  "South Asia": "#ffef00", // Couleur pour l'Asie du Sud
  "North Asia": "#88d8c0"  // Couleur pour l'Asie du Nord
};

let countryToRegion = {};
for (const regionId in simplemaps_worldmap_mapinfo.default_regions) {
  const region = simplemaps_worldmap_mapinfo.default_regions[regionId];
  for (const country of region.states) {
    countryToRegion[country] = region.name;
  }
}

function calculateRegionBBox(regionStates) {
  let minX = Infinity, maxX = 0, minY = Infinity, maxY = 0;
  regionStates.forEach(code => {
    const bbox = state_bbox_array[code];
    if (bbox) {
      minX = Math.min(minX, bbox.x);
      maxX = Math.max(maxX, bbox.x2);
      minY = Math.min(minY, bbox.y);
      maxY = Math.max(maxY, bbox.y2);
    }
  });
  return { minX, maxX, minY, maxY };
}


function drawSVGPaths() {

  const paths = window.simplemaps_worldmap_mapinfo.paths;
  const locations = window.simplemaps_worldmap_mapdata.locations;

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svgElement.setAttribute("viewBox", "0 0 2000 1000"); // Définir selon les besoins de votre carte
  svgElement.style.width = "100%";
  svgElement.style.height = "auto";

  function drawSVGPaths() {
    const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("viewBox", "0 0 2000 1000");
    svgElement.style.width = "100%";
    svgElement.style.height = "auto";
  
    Object.keys(state_bbox_array).forEach(country => {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("fill", "white");
      pathElement.setAttribute("stroke", "black");
      pathElement.setAttribute("stroke-width", "2");
      pathElement.setAttribute("data-country-code", country);
  
      pathElement.addEventListener('click', function() {
        const regionId = Object.keys(default_regions).find(id =>
          default_regions[id].states.includes(country)
        );
        if (regionId) {
          const bbox = calculateRegionBBox(default_regions[regionId].states);
          svgElement.setAttribute("viewBox", `${bbox.minX} ${bbox.minY} ${bbox.maxX - bbox.minX} ${bbox.maxY - bbox.minY}`);
        }
      })
  
      svgElement.appendChild(pathElement);
    });
  
    document.getElementById("mapContainer").appendChild(svgElement);
  }

      svgElement.appendChild(pathElement);
  }

  for (const city in locations) {
    const cityCoords = locations[city];
    const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", cityCoords.x);
    circleElement.setAttribute("cy", cityCoords.y);
    circleElement.setAttribute("r", "10");
    let fillColor;  
    if (cityCoords.winter === 0) {
        fillColor = "#fca311";  // Jeux d'été
    } else {
        fillColor = "#14213d";    // Jeux d'hiver
    }
    circleElement.setAttribute("fill", fillColor);
    circleElement.setAttribute("data-name", cityCoords.name);
    circleElement.setAttribute("data-year", cityCoords.year);
    circleElement.setAttribute("data-country", cityCoords.country);

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

// Créer le conteneur de la légende
const legendContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
legendContainer.setAttribute("transform", "translate(50, 900)"); // Position ajustée pour mieux s'adapter à la taille accrue

// Créer le cercle pour les JO d'été
const summerCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
summerCircle.setAttribute("cx", 20);
summerCircle.setAttribute("cy", 20); // Position Y ajustée
summerCircle.setAttribute("r", 15); // Taille du rayon augmentée
summerCircle.setAttribute("fill", "orange");
legendContainer.appendChild(summerCircle);

// Texte pour les JO d'été
const summerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
summerText.setAttribute("x", 50); // Position X ajustée pour mieux s'aligner avec le cercle plus grand
summerText.setAttribute("y", 25); // Position Y ajustée
summerText.textContent = "Summer Olympics";
summerText.style.fill = "#333";
summerText.style.fontSize = "18px"; // Taille de police augmentée
legendContainer.appendChild(summerText);

// Créer le cercle pour les JO d'hiver
const winterCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
winterCircle.setAttribute("cx", 20);
winterCircle.setAttribute("cy", 60); // Position Y ajustée pour plus d'espace
winterCircle.setAttribute("r", 15); // Taille du rayon augmentée
winterCircle.setAttribute("fill", "blue");
legendContainer.appendChild(winterCircle);

// Texte pour les JO d'hiver
const winterText = document.createElementNS("http://www.w3.org/2000/svg", "text");
winterText.setAttribute("x", 50); // Position X ajustée pour mieux s'aligner avec le cercle plus grand
winterText.setAttribute("y", 65); // Position Y ajustée
winterText.textContent = "Winter Olympics";
winterText.style.fill = "#333";
winterText.style.fontSize = "18px"; // Taille de police augmentée
legendContainer.appendChild(winterText);

// Ajouter la légende au SVG principal
svgElement.appendChild(legendContainer);
  document.getElementById("mapContainer").appendChild(svgElement);
}

document.addEventListener("DOMContentLoaded", drawSVGPaths);