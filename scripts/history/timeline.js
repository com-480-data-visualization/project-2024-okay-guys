// Données de la frise chronologique
const data = [
    { year: 1896, event: "1er Jeux Olympiques modernes à Athènes" },
    { year: 1936, event: "Jeux de Berlin et Jesse Owens" },
    { year: 1960, event: "Jeux de Rome, premier diffusé à la télévision" },
    // Ajoutez d'autres événements ici
];

// Configuration de la taille du SVG
const width = 800;
const height = 400;

// Création de l'élément SVG
const svg = d3.select('#timeline').append('svg')
    .attr('width', width)
    .attr('height', height);

// Création des cercles pour chaque événement
svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('cx', (d, i) => 100 + i * 150) // Position horizontale basée sur l'index
    .attr('cy', height / 2) // Position verticale au centre
    .attr('r', 20) // Rayon du cercle
    .attr('fill', 'steelblue');

// Ajout de tooltips pour chaque événement
svg.selectAll('circle')
    .append('title') // Tooltip
    .text(d => `${d.year}: ${d.event}`);
