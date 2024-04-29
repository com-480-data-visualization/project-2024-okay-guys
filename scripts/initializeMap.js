function drawSVGPaths() {
  const paths = window.simplemaps_worldmap_mapinfo.paths;
  const locations = window.simplemaps_worldmap_mapdata.locations;

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgElement.setAttribute("viewBox", "0 0 2000 1000");
  svgElement.style.width = "100%";
  svgElement.style.height = "auto";

  const defaultColor = '#ffffff';
  const hoverColor = '#ccc';

  for (const country in paths) {
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", paths[country]);
    pathElement.setAttribute("fill", defaultColor);
    pathElement.setAttribute("stroke", "black");
    pathElement.setAttribute("stroke-width", "2");

    pathElement.addEventListener('mouseover', function(event) {
      pathElement.setAttribute('fill', hoverColor); 
    });

    pathElement.addEventListener('mouseout', function(event) {
      pathElement.setAttribute('fill', defaultColor); 
    });

    svgElement.appendChild(pathElement);
  }

  for (const city in locations) {
    const cityCoords = locations[city];
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
    
      console.log(years);
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
    

    document.addEventListener('click', (event) => {
      if (!event.target.closest('circle')) {
          document.querySelectorAll('.tooltip').forEach(tooltip => {
              tooltip.classList.remove('show');
              setTimeout(() => { tooltip.remove(); }, 300);
          });
      }
    });

    svgElement.appendChild(circleElement);
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
