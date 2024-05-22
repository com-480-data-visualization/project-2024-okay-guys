// Données des événements des JO
const events = [
    { year: 1896, event: "Premiers JO modernes à Athènes" },
    { year: 1924, event: "Premiers JO d'hiver à Chamonix" },
    { year: 1936, event: "JO de Berlin, premières retransmissions télévisées" },
    { year: 1960, event: "Premiers JO télévisés en direct à Rome" },
    { year: 1980, event: "Boycott des JO de Moscou par les USA" },
    { year: 2008, event: "JO de Pékin, record de médailles pour Michael Phelps" },
    { year: 2021, event: "JO de Tokyo reportés à cause de la COVID-19" }
];

// Dimensions
const margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Échelle de temps
const x = d3.scaleTime()
    .domain([new Date(d3.min(events, d => d.year)), new Date(d3.max(events, d => d.year))])
    .range([0, width]);

// Axe
const xAxis = d3.axisBottom(x).ticks(events.length).tickFormat(d3.timeFormat("%Y"));

// Création du SVG
const svg = d3.select("#timeline").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Ajout de l'axe
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

// Ajout des événements
svg.selectAll(".event")
    .data(events)
  .enter().append("circle")
    .attr("class", "event")
    .attr("cx", d => x(new Date(d.year)))
    .attr("cy", height / 2)
    .attr("r", 5);

svg.selectAll(".event-text")
    .data(events)
  .enter().append("text")
    .attr("class", "event-text")
    .attr("x", d => x(new Date(d.year)))
    .attr("y", (height / 2) - 10)
    .attr("text-anchor", "middle")
    .text(d => d.event);
