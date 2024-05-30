/**
 * This script generates an interactive timeline visualization for the Summer and Winter Olympics.
 * The timeline includes flags representing each Olympic event, hover tooltips for additional information,
 * and a dynamic cursor that updates the year display and table content as the user scrolls.
 *
 * Functions:
 * - capitalize(str): Capitalizes the first letter of each word in a string.
 * - updateTable(data, tableId): Updates an HTML table with the provided data.
 * - createCombinedTimeline(summerData, winterData, element): Creates a combined timeline for Summer and Winter Olympics.
 *
 * Visualization:
 * - Generates an SVG timeline with flags representing Olympic events.
 * - Includes hover tooltips displaying detailed information about each event.
 * - Dynamic cursor updates year display and table content as the user scrolls.
 */

function capitalize(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Updates the content of an HTML table with the given data.
 *
 * @param {Array} data - Array of data objects containing continent, country, and city count information.
 * @param {string} tableId - ID of the table to be updated.
 */
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

/**
 * Creates a combined timeline visualization for the Summer and Winter Olympics.
 *
 * @param {Array} summerData - Array of data objects for the Summer Olympics.
 * @param {Array} winterData - Array of data objects for the Winter Olympics.
 * @param {string} element - CSS selector for the HTML element where the timeline will be appended.
 */
function createCombinedTimeline(summerData, winterData, element) {
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 7000 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const filteredSummerData = summerData.filter(d => d.Year <= 2024);
    const filteredWinterData = winterData.filter(d => d.Year <= 2024);

    const svg = d3.select(element).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const allData = filteredSummerData.concat(filteredWinterData);

    const x = d3.scaleTime()
        .domain(d3.extent(allData, d => new Date(d.Year, 0, 1)))
        .range([0, width]);

    // Year display group (hidden initially)
    const yearGroup = svg.append('g')
        .attr('class', 'year-display-group')
        .style('opacity', 0);

    const yearRect = yearGroup.append('rect')
        .attr('width', 50)
        .attr('height', 30)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('fill', 'white')
        .attr('stroke', 'black');

    const yearDisplay = yearGroup.append('text')
        .attr('x', 25)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'black');

    // X-axis
    const axis = svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height / 2})`)
        .call(d3.axisBottom(x)
            .ticks(filteredSummerData.length)
            .tickSize(0)
            .tickFormat(() => "")
        );

    // Tooltip for displaying event details
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Cursor for interactive year display
    const cursor = svg.append('circle')
        .attr('class', 'cursor')
        .attr('cy', height / 2)
        .attr('r', 5)
        .attr('fill', 'red')
        .style('opacity', 0);

    const cursorLine = svg.append('line')
        .attr('x1', 0)
        .attr('y1', height / 2)
        .attr('x2', 0)
        .attr('y2', height / 2)
        .attr('stroke', 'red')
        .attr('stroke-width', 2);

    // Scroll event listener for dynamic cursor and year display
    d3.select(element).node().parentNode.addEventListener('scroll', function() {
        const scrollX = this.scrollLeft;
        const maxScrollLeft = this.scrollWidth - this.clientWidth;
        const maxCursorX = width + margin.left;
        const relativeCursorX = scrollX / maxScrollLeft * maxCursorX;

        cursor.attr('cx', relativeCursorX);
        cursor.style('opacity', 1);
        cursorLine.attr('x2', relativeCursorX).style('opacity', 1);

        const cursorDate = x.invert(relativeCursorX);
        const cursorYear = cursorDate.getFullYear();
        yearDisplay.text(cursorYear);

        yearGroup.attr('transform', `translate(${relativeCursorX - 25},${margin.top - 30})`)
            .style('opacity', 1);

        svg.selectAll('.date-box')
            .classed('passed', function(d) {
                return new Date(d.Year, 0, 1) <= cursorDate;
            });

        document.getElementById('current-year').textContent = cursorYear;

        const filteredSummerData_ = filteredSummerData.filter(d => new Date(d.Year, 0, 1) <= cursorDate);
        const filteredWinterData_ = filteredWinterData.filter(d => new Date(d.Year, 0, 1) <= cursorDate);

        updateTable(filteredSummerData_, 'summer-olympics-table');
        updateTable(filteredWinterData_, 'winter-olympics-table');
    });

    // Draw lines and flags for Summer Olympics
    svg.selectAll('.line-summer')
        .data(filteredSummerData)
      .enter().append('line')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 - 50)
        .attr('stroke', 'orange')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => typeof d.City_count === 'string' ? '4,2' : 'none');

    svg.selectAll('.event-summer')
        .data(filteredSummerData)
      .enter().append('image')
        .attr('xlink:href', d => `https://flagcdn.com/32x24/${d.Iso}.png`)
        .attr('width', 32)
        .attr('height', 24)
        .attr('x', d => x(new Date(d.Year, 0, 1)) - 16) 
        .attr('y', height / 2 - 74) 
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

    // Draw lines and flags for Winter Olympics
    svg.selectAll('.line-winter')
        .data(filteredWinterData)
    .enter().append('line')
        .attr('class', 'line-winter')
        .attr('x1', d => x(new Date(d.Year, 0, 1)))
        .attr('y1', height / 2)
        .attr('x2', d => x(new Date(d.Year, 0, 1)))
        .attr('y2', height / 2 + 50)
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', d => typeof d.City_count === 'string' ? '4,2' : 'none');

    svg.selectAll('.event-winter')
        .data(filteredWinterData)
    .enter().append('image')
        .attr('xlink:href', d => `https://flagcdn.com/32x24/${d.Iso}.png`)
        .attr('width', 32)
        .attr('height', 24)
        .attr('x', d => x(new Date(d.Year, 0, 1)) - 16)
        .attr('y', height / 2 + 50)
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
        .on('mouseout', function() {
            tooltip.transition().duration(500).style('opacity', 0);
        });

    // Draw year labels for Summer Olympics
    svg.selectAll('.date-box-summer')
        .data(filteredSummerData)
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

    // Draw year labels for Winter Olympics
    svg.selectAll('.date-box-winter')
        .data(filteredWinterData)
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
    

   