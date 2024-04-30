const paths = window.simplemaps_worldmap_mapinfo.paths;
const default_regions = window.simplemaps_worldmap_mapinfo.default_regions;
const locations = window.simplemaps_worldmap_mapdata.locations;
const state_bbox_array = window.simplemaps_worldmap_mapinfo.state_bbox_array;
const id_pays = window.simplemaps_worldmap_mapinfo.names;
const countryIdsByName = {};
for (const id in id_pays) {
    const name = id_pays[id];
    countryIdsByName[name] = id;
}

console.log(countryIdsByName); 

function drawSVGPaths() {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("viewBox", "0 0 2000 1000");
  svgElement.style.width = "100%";
  svgElement.style.height = "auto";

  const defaultColor = '#ffffff';
  const hoverColor = '#ccc';

  // Définir une variable pour stocker la région actuellement sélectionnée
  let selectedRegion = 0;

  for (const country in paths) {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", paths[country]);
    pathElement.setAttribute("fill", defaultColor);
    pathElement.setAttribute("stroke", "black");
    pathElement.setAttribute("stroke-width", "2");
    pathElement.setAttribute("id", country);
    
    const region = findRegionByCountry(country);
    if (region !== null) {
        pathElement.setAttribute("default_region", region);
    }
    
    pathElement.addEventListener('mouseover', function(event) {
      pathElement.setAttribute('fill', hoverColor); 
    });

    pathElement.addEventListener('mouseout', function(event) {
      pathElement.setAttribute('fill', defaultColor); 
    });

    pathElement.addEventListener('click', function(event) {
      selectedRegion = pathElement.getAttribute('default_region');
      
      // Afficher uniquement les emplacements de la région cliquée
      for (const city in locations) {
        const cityCoords = locations[city];
        const cityCountryId = countryIdsByName[cityCoords.country];
        const cityRegion = findRegionByCountry(cityCountryId);
        
        // Si aucune région n'est sélectionnée ou si l'emplacement est dans la région sélectionnée, afficher l'emplacement
        console.log(selectedRegion);
        if (!selectedRegion || cityRegion === selectedRegion) {
          const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circleElement.setAttribute("cx", cityCoords.x);
          circleElement.setAttribute("cy", cityCoords.y);
          circleElement.setAttribute("r", "10");

          const fillColor = cityCoords.winter === 0 ? "orange" : "blue";
          circleElement.setAttribute("fill", fillColor);
          circleElement.setAttribute("data-name", cityCoords.name);
          circleElement.setAttribute("data-year", cityCoords.year);
          circleElement.setAttribute("data-country", cityCoords.country);

          circleElement.addEventListener('click', (event) => {
            document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());
            
            const tooltip = document.createElement('div');
            tooltip.style.position = 'absolute';
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.className = 'tooltip';
          
            const cityName = event.target.getAttribute('data-name');
            const countryName = event.target.getAttribute('data-country');
            const years = event.target.getAttribute('data-year').split(',').map(year => parseInt(year)).sort((a, b) => a - b);

            const cityCountrySpan = document.createElement('span');
            cityCountrySpan.className = 'city-country';
            cityCountrySpan.textContent = `${cityName}, ${countryName}`;
          
            const yearSpan = document.createElement('span');
            yearSpan.className = 'year';
            yearSpan.textContent = years.join(', ');
          
            tooltip.appendChild(cityCountrySpan);
            tooltip.appendChild(document.createElement('br'));
            tooltip.appendChild(yearSpan);
          
            document.body.appendChild(tooltip);
            setTimeout(() => { tooltip.classList.add('show'); }, 10);
          });
          

          svgElement.appendChild(circleElement);
        }
      }

      // Réinitialiser la vue de la carte pour zoomer sur la boîte englobante de la région
      const boundingBox = calculateBoundingBox(selectedRegion);
      svgElement.setAttribute("viewBox", `${boundingBox.minX} ${boundingBox.minY} ${boundingBox.width} ${boundingBox.height}`);
    });
    
    svgElement.appendChild(pathElement);
  }

  function calculateBoundingBox(region) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    Object.keys(state_bbox_array).forEach(country_id => {
      if (default_regions[region].states.includes(country_id)) {
        const bbox = state_bbox_array[country_id];
        minX = Math.min(minX, bbox.x);
        minY = Math.min(minY, bbox.y);
        maxX = Math.max(maxX, bbox.x2);
        maxY = Math.max(maxY, bbox.y2);
      }
    });
    return { minX, minY, width: maxX - minX, height: maxY - minY };
  }
  
  function findRegionByCountry(country) {
    for (const regionId in default_regions) {
        const region = default_regions[regionId];
        if (region.states.includes(country)) {
            return regionId;
        }
    }
    return null;
  }

  const legendContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  legendContainer.setAttribute("transform", "translate(50, 900)");

  const createLegendItem = (cx, cy, fill, text) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", "15");
    circle.setAttribute("fill", fill);

    const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.setAttribute("x", cx + 30);
    textElement.setAttribute("y", cy + 5);
    textElement.textContent = text;
    textElement.style.fill = "#333";
    textElement.style.fontSize = "20px"; 
    textElement.style.fontWeight = "bold"; 

    legendContainer.appendChild(circle);
    legendContainer.appendChild(textElement);
  };

  createLegendItem(20, 20, "orange", "Summer Olympics");
  createLegendItem(20, 60, "blue", "Winter Olympics");

  svgElement.appendChild(legendContainer);

  document.getElementById("mapContainer").appendChild(svgElement);
}

document.addEventListener("DOMContentLoaded", drawSVGPaths);

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById('backButton');
  const svgElement = document.querySelector("svg");

  // Ajouter un gestionnaire d'événements de clic à la flèche de retour en arrière
  backButton.addEventListener('click', () => {
    // Réinitialiser la visibilité de tous les emplacements pour afficher à nouveau tous les pays
    const circles = document.querySelectorAll('circle');
    circles.forEach(circle => circle.remove());

    // Réinitialiser le zoom en ajustant la vue de la carte pour qu'elle s'adapte à toute la carte
    svgElement.setAttribute("viewBox", "0 0 2000 1000");

    // Réinitialiser la région sélectionnée
    selectedRegion = null;
  });
});
