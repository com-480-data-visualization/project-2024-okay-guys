function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function createCombinedTimeline(summerData, winterData, element) {
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 7000 - margin.left - margin.right; // Largeur étendue pour le défilement
    const height = 300 - margin.top - margin.bottom; // Hauteur ajustée

    const svg = d3.select(element).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = summerData.concat(winterData);

    const x = d3.scaleTime()
        .domain(d3.extent(allData, d => new Date(d.Year, 0, 1)))
        .range([0, width]);

    // Axe central
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x)
            .ticks(summerData.length)
            .tickSize(0)
            .tickFormat(() => "")
        )
        .attr('stroke-width', 2); // Épaissir l'axe central

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Lignes pour les événements d'été
    svg.selectAll('.line-summer')
        .data(summerData)
      .enter().append('line')
        .attr('class', 'line-summer')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 - 50)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.Notabene ? '4,2' : 'none'); // Pointillé pour événements annulés

    // Drapeaux pour les Jeux d'été
    svg.selectAll('.event-summer')
        .data(summerData)
      .enter().append('image')
        .attr('xlink:href', d => `https://flagcdn.com/32x24/${d.Iso}.png`)
        .attr('width', 32)
        .attr('height', 24)
        .attr('x', d => x(new Date(d.Year, 0, 1)) - 16) // Centrer le drapeau
        .attr('y', height / 2 - 74) // Position au-dessus de l'axe central
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`
                <strong>City</strong>: ${capitalize(d.City)}<br>
                <strong>Country</strong>: ${capitalize(d.Country)}<br>
                <strong>Year</strong>: ${d.Year}<br>
                <strong>Hosted</strong>: ${d.City_count || 1} time(s).<br>
                ${d.Notabene ? `<strong>Note</strong>: ${d.Notabene}` : ''}
            `)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Lignes pour les événements d'hiver
    svg.selectAll('.line-winter')
        .data(winterData)
      .enter().append('line')
        .attr('class', 'line-winter')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 + 50)
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => d.Notabene ? '4,2' : 'none'); // Pointillé pour événements annulés

    // Drapeaux pour les Jeux d'hiver
    svg.selectAll('.event-winter')
        .data(winterData)
      .enter().append('image')
        .attr('xlink:href', d => `https://flagcdn.com/32x24/${d.Iso}.png`)
        .attr('width', 32)
        .attr('height', 24)
        .attr('x', d => x(new Date(d.Year, 0, 1)) - 16) // Centrer le drapeau
        .attr('y', height / 2 + 50) // Position en dessous de l'axe central
        .on('mouseover', function(event, d) {
            tooltip.transition().duration(200).style('opacity', .9);
            tooltip.html(`
                <strong>City</strong>: ${capitalize(d.City)}<br>
                <strong>Country</strong>: ${capitalize(d.Country)}<br>
                <strong>Year</strong>: ${d.Year}<br>
                <strong>Hosted</strong>: ${d.City_count || 1} time(s).<br>
                ${d.Notabene ? `<strong>Note</strong>: ${d.Notabene}` : ''}
            `)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function(d) {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Ajouter des carrés avec les années au niveau de la jonction entre l'axe principal et les barres
    svg.selectAll('.date-box-summer')
        .data(summerData)
      .enter().append('g')
        .attr('transform', d => `translate(${x(new Date(d.Year, 0, 1))},${height / 2})`)
        .each(function(d) {
            const g = d3.select(this);
            const textElem = g.append('text')
                .attr('x', 0)
                .attr('y', 4)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text(d.Year);

            const bbox = textElem.node().getBBox();
            g.insert('rect', 'text')
                .attr('class', 'date-box')
                .attr('x', bbox.x - 4)
                .attr('y', bbox.y - 2)
                .attr('width', bbox.width + 8)
                .attr('height', bbox.height + 4);
        });

    svg.selectAll('.date-box-winter')
        .data(winterData)
      .enter().append('g')
        .attr('transform', d => `translate(${x(new Date(d.Year, 0, 1))},${height / 2})`)
        .each(function(d) {
            const g = d3.select(this);
            const textElem = g.append('text')
                .attr('x', 0)
                .attr('y', 4)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .text(d.Year);

            const bbox = textElem.node().getBBox();
            g.insert('rect', 'text')
                .attr('class', 'date-box')
                .attr('x', bbox.x - 4)
                .attr('y', bbox.y - 2)
                .attr('width', bbox.width + 8)
                .attr('height', bbox.height + 4);
        });
}
