function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

function updateTable(data, tableId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    tableBody.innerHTML = '';

    const continentCounts = {};

    data.forEach(d => {
        const continent = capitalize(d.Continent);
        const country = capitalize(d.Country);
        if (d.City_count === "Canceled") {
            return; 
        }
        if (!continentCounts[continent]) {
            continentCounts[continent] = { count: 0, countries: {} };
        }
        continentCounts[continent].count += 1;

        if (!continentCounts[continent].countries[country]) {
            continentCounts[continent].countries[country] = { count: 0, iso: d.Iso };
        }
        continentCounts[continent].countries[country].count += 1;
    });

    const sortedContinents = Object.keys(continentCounts).sort((a, b) => continentCounts[b].count - continentCounts[a].count);

    sortedContinents.forEach(continent => {
        const continentCount = continentCounts[continent].count;
        const countries = Object.keys(continentCounts[continent].countries).sort((a, b) => continentCounts[continent].countries[b].count - continentCounts[continent].countries[a].count);

        let firstContinentRow = true;
        countries.forEach((country, countryIndex) => {
            const countryData = continentCounts[continent].countries[country];
            const row = document.createElement('tr');
            row.innerHTML = `
                ${firstContinentRow ? `<td rowspan="${countries.length}" class="centered">${continent}</td>` : ''}
                ${firstContinentRow ? `<td rowspan="${countries.length}" class="centered">${continentCount}</td>` : ''}
                <td class="centered"><img src="https://flagcdn.com/24x18/${countryData.iso}.png" alt="${country}"> ${country}</td>
                <td class="centered">${countryData.count}</td>
            `;
            tableBody.appendChild(row);

            firstContinentRow = false;
        });
    });
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

    // Ajouter un groupe pour afficher l'année dans un carré blanc
    const yearGroup = svg.append('g')
        .attr('class', 'year-display-group')
        .style('opacity', 0); // Initialement caché

    const yearRect = yearGroup.append('rect')
    .attr('width', 50)
    .attr('height', 30)
    .attr('rx', 5) // Rayon de coin horizontal
    .attr('ry', 5) // Rayon de coin vertical
    .attr('fill', 'white')
    .attr('stroke', 'black');
    

    const yearDisplay = yearGroup.append('text')
        .attr('x', 25) // Centrer le texte dans le rectangle
        .attr('y', 20) // Ajuster la position selon vos besoins
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'black');

    // Axe central
    const axis = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x)
            .ticks(summerData.length)
            .tickSize(0)
            .tickFormat(() => "")
        );


    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    const cursor = svg.append('circle')
        .attr('class', 'cursor')
        .attr('cy', height / 2)
        .attr('r', 5)
        .attr('fill', 'red')
        .style('opacity', 0);

    // Ajouter la ligne rouge qui se déplace avec le curseur
    const cursorLine = svg.append('line')
        // .attr('class', 'cursor-line')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', 0)
        .attr('y2', height / 2)
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
    
        
     // Événement de défilement
     d3.select(element).node().parentNode.addEventListener('scroll', function() {
        const scrollX = this.scrollLeft ;
        const maxScrollLeft = this.scrollWidth - this.clientWidth;
        const maxCursorX = width + margin.left;
        const relativeCursorX = scrollX / maxScrollLeft * maxCursorX;

        cursor.attr('cx', relativeCursorX);
        cursor.style('opacity', 1);
        cursorLine.attr('x2', relativeCursorX).style('opacity', 1);

        // Trouver l'année correspondant à la position du curseur
        const cursorDate = x.invert(relativeCursorX);
        const cursorYear = cursorDate.getFullYear();
        yearDisplay.text(cursorYear);

        // Mettre à jour la position et l'affichage du groupe de l'année
        yearGroup.attr('transform', `translate(${relativeCursorX - 25},${margin.top - 30})`)
            .style('opacity', 1); // Rendre le groupe visible

        // Mettre à jour les boîtes de date
        svg.selectAll('.date-box')
            .classed('passed', function(d) {
                return new Date(d.Year, 0, 1) <= cursorDate;
            });

        // Mettre à jour l'élément affichant l'année courante au-dessus des tableaux
        document.getElementById('current-year').textContent = cursorYear;

        // Filtrer les données en fonction de l'année du curseur
        const filteredSummerData = summerData.filter(d => new Date(d.Year, 0, 1) <= cursorDate);
        const filteredWinterData = winterData.filter(d => new Date(d.Year, 0, 1) <= cursorDate);

        // Mettre à jour les tableaux dynamiques
        updateTable(filteredSummerData, 'summer-olympics-table');
        updateTable(filteredWinterData, 'winter-olympics-table');

    });

    // Lignes pour les événements d'été
    svg.selectAll('.line-summer')
        .data(summerData)
      .enter().append('line')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 - 50)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => typeof d.City_count === 'string' ? '4,2' : 'none'); // Pointillé pour les City_count en string


    // Lignes pour les événements d'été
    svg.selectAll('.line-summer')
        .data(summerData)
      .enter().append('line')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 - 50)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => typeof d.City_count === 'string' ? '4,2' : 'none'); // Pointillé pour les City_count en string

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
            const hostedText = typeof d.City_count === 'string' 
                ? d.City_count 
                : `${d.City_count || 1} time(s).`;
            tooltip.html(`
                <strong>City</strong>: ${capitalize(d.City)}<br>
                <strong>Country</strong>: ${capitalize(d.Country)}<br>
                <strong>Year</strong>: ${d.Year}<br>
                <strong>Hosted</strong>: ${hostedText}<br>
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
        .attr('stroke-dasharray', d => typeof d.City_count === 'string' ? '4,2' : 'none'); // Pointillé pour les City_count en string

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
            const hostedText = typeof d.City_count === 'string' 
                ? d.City_count 
                : `${d.City_count || 1} time(s).`;
            tooltip.html(`
                <strong>City</strong>: ${capitalize(d.City)}<br>
                <strong>Country</strong>: ${capitalize(d.Country)}<br>
                <strong>Year</strong>: ${d.Year}<br>
                <strong>Hosted</strong>: ${hostedText}<br>
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
