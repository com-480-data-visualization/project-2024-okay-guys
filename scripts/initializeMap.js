// Configuration initiale et récupération des données depuis la structure de la carte
const mapInfo = window.simplemaps_worldmap_mapinfo;
const { paths, defaultRegions, stateBboxArray } = mapInfo;
const locations = window.simplemaps_worldmap_mapdata.locations;
const countryNames = mapInfo.idToNames;

// Styles par défaut
const defaultColor = '#ffffff';
const hoverColor = '#ccc';

// Conversion des noms de pays en identifiants
const countryIdsByName = Object.fromEntries(Object.entries(countryNames).map(([id, name]) => [name, id]));

function findRegionByCountry(country) {
    return Object.entries(defaultRegions).find(([_, region]) => region.states.includes(country))?.[0];
}

function createSVGElement() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 2000 1000");
    svg.style.width = "80%";
    svg.style.height = "auto";
    return svg;
}

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


function changeRegionColor(region, color) {
    const paths = document.querySelectorAll(`path[data-region="${region}"]`);
    console.log(paths);
    paths.forEach(path => {
        path.setAttribute('fill', color);
    });
}
function addPathEventListeners(path) {
    path.addEventListener('mouseover', () => changeRegionColor(path.getAttribute('data-region'), hoverColor)); // Changement de couleur lors du survol
    path.addEventListener('mouseout', () => changeRegionColor(path.getAttribute('data-region'), defaultColor)); // Revenir à la couleur par défaut lors de la sortie de la souris
}


function handleRegionClick(region, svgElement) {
    const boundingBox = calculateBoundingBox(region);
    svgElement.setAttribute("viewBox", `${boundingBox.minX} ${boundingBox.minY} ${boundingBox.width} ${boundingBox.height}`);
    displayPathsByRegion(region, svgElement);
    adjustSvgSize(); 
}

function displayPathsByRegion(selectedRegion, svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        // Vérifier si le chemin appartient à la région sélectionnée
        if (path.getAttribute('data-region') === selectedRegion) {
            path.style.display = 'block';
            path.addEventListener('mouseover', () => changeRegionColor(path.getAttribute('data-region'), defaultColor)); // Changement de couleur lors du survo
            path.addEventListener('mouseover', () => path.setAttribute('fill', hoverColor));
            path.addEventListener('mouseout', () => path.setAttribute('fill', defaultColor));
        } else {
            path.style.display = 'none'; 
        }
    });
    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        // Vérifier si la location appartient à la région sélectionnée
        if (circle.getAttribute('data-region') === selectedRegion) {
            circle.style.display = 'block';
            circle.setAttribute("r", "4");
        } else {
            circle.style.display = 'none'; 
        }
    });
    const legend = document.querySelector('.legend-container');
    legend.style.display = 'none';

}

function createCityElement(city, cityRegion) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", city.x);
    circle.setAttribute("cy", city.y);
    circle.setAttribute("r", "7");
    circle.setAttribute("fill", city.winter === 0 ? "orange" : "blue");
    circle.setAttribute("data-region", cityRegion);
    circle.addEventListener('mouseover', event => showTooltip(event, city));
    circle.addEventListener('mouseout', hideTooltip);
    return circle;
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

function createLegend(svgElement) {
    const legendItems = [
      { fill: "orange", text: "Summer Olympics" },
      { fill: "blue", text: "Winter Olympics" }
    ];
  
    const legendContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
    legendContainer.classList.add("legend-container"); // Ajout de la classe CSS pour le conteneur de légende
  
    legendItems.forEach(({ fill, text }, index) => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.classList.add("legend-circle"); // Ajout de la classe CSS pour le cercle de légende
      circle.setAttribute("cx", 20);
      circle.setAttribute("cy", 20 + 40 * index);
      circle.setAttribute("r", "15");
      circle.setAttribute("fill", fill);
  
      const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElement.classList.add("legend-text"); // Ajout de la classe CSS pour le texte de légende
      textElement.setAttribute("x", 50);
      textElement.setAttribute("y", 40 + 40 * index);
      textElement.textContent = text;
  
      legendContainer.appendChild(circle);
      legendContainer.appendChild(textElement);
    });
  
    svgElement.appendChild(legendContainer);
}
  
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

document.addEventListener("DOMContentLoaded", () => {
    const svgElement = createSVGElement();
    document.getElementById("mapContainer").appendChild(svgElement);
    drawSVGPaths(svgElement);
    createLegend(svgElement);
    adjustSvgSize(); 

    window.addEventListener('resize', adjustSvgSize); // Ecouteur pour les redimensionnements de la fenêtre

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        svgElement.setAttribute("viewBox", "0 0 2000 1000");
        resetPathVisibility(svgElement);
        adjustSvgSize();
    });
});

function resetPathVisibility(svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        path.style.display = 'block'; // Réafficher tous les chemins
        addPathEventListeners(path);
    });
    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        circle.style.display = 'block';
        circle.setAttribute("r", "7");

    });
    const legend = document.querySelector('.legend-container');
    legend.style.display = 'block';

}

function adjustSvgSize() {
    const container = document.getElementById('mapContainer');
    const svgElement = document.querySelector('#mapContainer svg');
    if (svgElement && container) {
        svgElement.style.width = '80%'; // Assurer que le SVG occupe toujours 100% de la largeur du conteneur
        svgElement.style.height = container.offsetWidth * 0.5 + 'px'; // Ajuster la hauteur basée sur le ratio désiré
    }
}