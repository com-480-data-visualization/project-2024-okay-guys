function createCombinedTimeline(summerData, winterData, element) {
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 2000 - margin.left - margin.right; // Largeur étendue pour le défilement
    const height = 200 - margin.top - margin.bottom;

    const svg = d3.select(element).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = summerData.concat(winterData);

    const x = d3.scaleTime()
        .domain(d3.extent(allData, d => new Date(d.Year, 0, 1)))
        .range([0, width]);

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x).tickFormat('')); // Suppression des ticks par défaut

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    svg.selectAll('.event-summer')
        .data(summerData)
      .enter().append('circle')
        .attr('class', 'event event-summer')
        .attr('cx', d => x(new Date(d.Year, 0, 1)))
        .attr('cy', height / 2 - 20) // Décalage pour les Jeux d'été
        .attr('r', 5)
        .on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`${d.City}, ${d.Year}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', d => {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    svg.selectAll('.event-winter')
        .data(winterData)
      .enter().append('circle')
        .attr('class', 'event event-winter')
        .attr('cx', d => x(new Date(d.Year, 0, 1)))
        .attr('cy', height / 2 + 20) // Décalage pour les Jeux d'hiver
        .attr('r', 5)
        .on('mouseover', (event, d) => {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`${d.City}, ${d.Year}`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', d => {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Ajouter des labels d'années sous chaque point
    svg.selectAll('.year-label-summer')
        .data(summerData)
      .enter().append('text')
        .attr('class', 'year-label')
        .attr('x', d => x(new Date(d.Year, 0, 1)))
        .attr('y', height / 2 - 30)
        .text(d => d.Year);

    svg.selectAll('.year-label-winter')
        .data(winterData)
      .enter().append('text')
        .attr('class', 'year-label')
        .attr('x', d => x(new Date(d.Year, 0, 1)))
        .attr('y', height / 2 + 30)
        .text(d => d.Year);
}
