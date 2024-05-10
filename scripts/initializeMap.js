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
    svg.style.width = "100%";
    svg.style.height = "1000px";
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

function addPathEventListeners(path) {
    path.addEventListener('mouseover', () => path.setAttribute('fill', hoverColor));
    path.addEventListener('mouseout', () => path.setAttribute('fill', defaultColor));
    }

function handleRegionClick(region, svgElement) {
    const boundingBox = calculateBoundingBox(region);
    svgElement.setAttribute("viewBox", `${boundingBox.minX} ${boundingBox.minY} ${boundingBox.width} ${boundingBox.height}`);
    displayPathsByRegion(region, svgElement);
}

function displayPathsByRegion(selectedRegion, svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        // Vérifier si le chemin appartient à la région sélectionnée
        if (path.getAttribute('data-region') === selectedRegion) {
            path.style.display = 'block';
        } else {
            path.style.display = 'none'; 
        }
    });
    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        // Vérifier si la location appartient à la région sélectionnée
        if (circle.getAttribute('data-region') === selectedRegion) {
            circle.style.display = 'block';
        } else {
            circle.style.display = 'none'; 
        }
    });

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

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', () => {
        // Réinitialiser le zoom en ajustant la vue de la carte pour qu'elle s'adapte à toute la carte
        svgElement.setAttribute("viewBox", "0 0 2000 1000");

        // Réinitialiser l'affichage de tous les chemins
        resetPathVisibility(svgElement);

        // Réinitialiser la région sélectionnée et réafficher toutes les villes
        displayCities(null, svgElement);
    });
});

function resetPathVisibility(svgElement) {
    const allPaths = svgElement.querySelectorAll('path');
    allPaths.forEach(path => {
        path.style.display = 'block'; // Réafficher tous les chemins
    });
    const allCircle = svgElement.querySelectorAll('circle');
    allCircle.forEach(circle => {
        circle.style.display = 'block';
    });
}
