function drawSVGPaths() {
  // Assurez-vous que simplemaps_worldmap_mapinfo est chargé
  if (!window.simplemaps_worldmap_mapinfo) {
      console.error("Map data is not loaded.");
      return;
  }
  const paths = window.simplemaps_worldmap_mapinfo.paths;
  const locations = window.simplemaps_worldmap_mapdata.locations;
  // const statSpecific = window.simplemaps_worldmap_mapdata.state_specific; // Ajout de cette ligne pour récupérer les informations spécifiques à chaque pays

  const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svgElement.setAttribute("viewBox", "0 0 2000 1000"); // Définir selon les besoins de votre carte
  svgElement.style.width = "100%";
  svgElement.style.height = "auto";

  const default_color = '#ffffff'
  const hover_color = '#bbdef0'
  for (const country in paths) {
      const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
      pathElement.setAttribute("d", paths[country]);
      pathElement.setAttribute("fill", default_color); // Changer la couleur au besoin
      pathElement.setAttribute("stroke", "black");
      pathElement.setAttribute("stroke-width", "2");

      pathElement.addEventListener('mouseover', function(event) {
        pathElement.setAttribute('fill', hover_color); // Couleur de survol
      });

    // Ajout de l'événement mouseout pour restaurer la couleur par défaut lorsque la souris quitte
    pathElement.addEventListener('mouseout', function(event) {
      pathElement.setAttribute('fill', default_color); // Couleur par défaut
    });
    
    // // Ajouter le gestionnaire d'événements de clic pour le zoom sur le pays
    // pathElement.addEventListener('click', function(event) {
    //   zoomToCountry(country, svgElement);
    // });
    
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

// Définition de la fonction pour zoomer sur un pays spécifique
function zoomToCountry(countryCode, svgElement) {
  console.log(countryCode); // Afficher le countryCode dans la console
  const countryInfo = simplemaps_worldmap_mapinfo.state_bbox_array[countryCode];

  if (countryInfo) {
    const centerX = (countryInfo.x + countryInfo.x2) / 2;
    const centerY = (countryInfo.y + countryInfo.y2) / 2;

    // Ajustez la vue pour centrer le pays
    const translateX = -centerX + 500; // Vous pouvez ajuster cette valeur pour centrer le pays correctement dans la vue
    const translateY = -centerY + 300;

    svgElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
  }
}


document.addEventListener("DOMContentLoaded", drawSVGPaths);