function createCombinedTimeline(summerData, winterData, element) {
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 5000 - margin.left - margin.right; // Largeur étendue pour le défilement
    const height = 300 - margin.top - margin.bottom; // Hauteur augmentée pour deux axes

    const svg = d3.select(element).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = summerData.concat(winterData);

    const x = d3.scaleTime()
        .domain(d3.extent(allData, d => new Date(d.Year, 0, 1)))
        .range([0, width]);

    // Axe des Jeux d'été
    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height / 3})`)
    .call(d3.axisBottom(x)
        .ticks(summerData.length)
        .tickSize(0)
        .tickFormat(() => "") 
    );

    // Axe des Jeux d'hiver
    svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${(2 * height) / 3})`)
    .call(d3.axisBottom(x)
        .ticks(winterData.length)
        .tickSize(0)
        .tickFormat(() => "") 
    );

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    svg.selectAll('.event-summer')
        .data(summerData)
      .enter().append('circle')
        .attr('fill', "orange")
        .attr('cx', d => x(new Date(d.Year, 0, 1)))
        .attr('cy', height / 3)
        .attr('r', 10)
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
        .attr('fill', "blue")
        .attr('cx', d => x(new Date(d.Year, 0, 1)))
        .attr('cy', (2 * height) / 3) 
        .attr('r', 10)
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
        .attr('y', height / 2 -50)
        .text(d => d.Year);

    svg.selectAll('.year-label-winter')
        .data(winterData)
      .enter().append('text')
        .attr('class', 'year-label')
        .attr('x', d => x(new Date(d.Year, 0, 1)))
        .attr('y', height / 2 + 30)
        .text(d => d.Year);
}
