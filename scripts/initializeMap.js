// Configuration initiale et récupération des données depuis la structure de la carte
const mapInfo = window.simplemaps_worldmap_mapinfo;
const paths = mapInfo.paths;
const defaultRegions = mapInfo.default_regions;
const locations = window.simplemaps_worldmap_mapdata.locations;
const stateBboxArray = mapInfo.state_bbox_array;
const countryNames = mapInfo.idToNames;
const defaultColor = '#ffffff';
const hoverColor = '#ccc';

// Conversion des noms de pays en identifiants
const countryIdsByName = Object.fromEntries(Object.entries(countryNames).map(([id, name]) => [name, id]));

// Fonction pour trouver la région par pays
function findRegionByCountry(country) {
  return Object.entries(defaultRegions).find(([_, region]) => region.states.includes(country))?.[0];
}

// Dessin des chemins SVG pour les pays
function drawSVGPaths() {
  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("viewBox", "0 0 2000 1000");
  svgElement.style.width = "100%";
  svgElement.style.height = "1000px";

  let selectedRegion = null;

  // Traitement et ajout des chemins de chaque pays
  Object.entries(paths).forEach(([country, dPath]) => {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", dPath);
    pathElement.setAttribute("fill", defaultColor);
    pathElement.setAttribute("stroke", "black");
    pathElement.setAttribute("stroke-width", "2");
    pathElement.setAttribute("id", country);

    const region = findRegionByCountry(country);
    pathElement.setAttribute("data-region", region || '');

    displayCities(selectedRegion, svgElement); 

    pathElement.addEventListener('mouseover', () => pathElement.setAttribute('fill', hoverColor));
    pathElement.addEventListener('mouseout', () => pathElement.setAttribute('fill', defaultColor));
    pathElement.addEventListener('click', () => handleCountryClick(pathElement, svgElement));

    svgElement.appendChild(pathElement);
  });

  // Ajout de la légende
  createLegend(svgElement);
  document.getElementById("mapContainer").appendChild(svgElement);
}

// Gestion du clic sur un pays
function handleCountryClick(pathElement, svgElement) {
  const selectedRegion = pathElement.getAttribute('data-region');
  const boundingBox = calculateBoundingBox(selectedRegion);
  svgElement.setAttribute("viewBox", `${boundingBox.minX} ${boundingBox.minY} ${boundingBox.width} ${boundingBox.height}`);
  displayCities(selectedRegion, svgElement);
}

// Affichage des villes en fonction de la région sélectionnée
function displayCities(region, svgElement) {
  Object.entries(locations).forEach(([_, city]) => {

    const cityCountryId = countryIdsByName[city.country];
    const cityRegion = findRegionByCountry(cityCountryId);
    
    if (region === null || cityRegion === region ) {
      const circleElement = createCityElement(city);
      svgElement.appendChild(circleElement);
    }
  
  });
}

// Création des éléments SVG pour les villes
function createCityElement(city) {
  const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circleElement.setAttribute("cx", city.x);
  circleElement.setAttribute("cy", city.y);
  circleElement.setAttribute("r", "7");
  circleElement.setAttribute("fill", city.winter === 0 ? "orange" : "blue");
  circleElement.addEventListener('mouseover', (event) => showTooltip(event, city));
  circleElement.addEventListener('mouseout', () => hideTooltip());
  return circleElement;
}

function createLegend(svgElement) {
  const legendItems = [
    { cx: 20, cy: 20, fill: "orange", text: "Summer Olympics" },
    { cx: 20, cy: 60, fill: "blue", text: "Winter Olympics" }
  ];

  const legendContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  legendContainer.setAttribute("transform", "translate(50, 900)");

  legendItems.forEach(({ cx, cy, fill, text }) => {
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
  });

  svgElement.appendChild(legendContainer);
}

// Affichage d'un tooltip pour les détails de la ville
function showTooltip(event, city) {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;
  tooltip.innerHTML = `<span class='city-country'>${city.name}, ${city.country}</span><br><span class='year'>${city.year}</span>`;
  document.body.appendChild(tooltip);
  setTimeout(() => { tooltip.classList.add('show'); }, 10);
}

function hideTooltip() {
  const tooltip = document.querySelector('.tooltip');
  if (tooltip) {
    tooltip.classList.remove('show');
    setTimeout(() => { tooltip.remove(); }, 10);
  }
}

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

// Initialisation une fois le document chargé
document.addEventListener("DOMContentLoaded", drawSVGPaths);

document.addEventListener("DOMContentLoaded", () => {
  const backButton = document.getElementById('backButton');
  const svgElement = document.querySelector("svg");

  // Ajouter un gestionnaire d'événements de clic à la flèche de retour en arrière
  backButton.addEventListener('click', () => {

    // Réinitialiser le zoom en ajustant la vue de la carte pour qu'elle s'adapte à toute la carte
    svgElement.setAttribute("viewBox", "0 0 2000 1000");

    // Réinitialiser la région sélectionnée
    selectedRegion = null;
    displayCities(selectedRegion, svgElement); 
  });
});