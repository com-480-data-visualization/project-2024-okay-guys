document.addEventListener('DOMContentLoaded', () => {
  Papa.parse('../data/data.csv', {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      const processedData = processEventData(data);
      initializeYearSelector(data, processedData);

      // Automatically select random year, discipline, and event
      selectRandomOptions(data, processedData);
    }
  });

  fetch('../data/noc_to_iso_mapping.json')
    .then(response => response.json())
    .then(data => {
      window.nocToIso = data;
    })
    .catch(error => console.error('Error loading NOC to ISO mapping:', error));
});

function processEventData(data) {
  const eventInfo = {};

  data.sort((a, b) => {
    const dateA = parseDate(a.result_date);
    const dateB = parseDate(b.result_date);
    return dateA - dateB;
  });

  data.forEach(row => {
    const eventTitle = row['event_title'];
    const performance = row['performance_combined'];
    const winner = row['athlete_combined'];
    const pos = row['pos'];
    const noc = row['noc'];

    if (!eventInfo[eventTitle]) {
      eventInfo[eventTitle] = {
        lastRecord: null,
        lastRecordHolder: null,
        lastWinner: null,
        isNewEvent: true
      };
    }

    if (performance && performance !== '') {
      eventInfo[eventTitle].lastRecord = performance;
      eventInfo[eventTitle].lastRecordHolder = winner || noc;
      eventInfo[eventTitle].isNewEvent = false;
    } else if (pos == 1) {
      eventInfo[eventTitle].lastWinner = winner || noc;
      eventInfo[eventTitle].isNewEvent = false;
    }
  });

  return eventInfo;
}

function parseDate(dateStr) {
  const formats = ["%d %B %Y — %H:%M", "%d %B %Y"];
  for (let fmt of formats) {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate)) {
      return parsedDate;
    }
  }
  return new Date(0); // Return epoch if date can't be parsed
}

function initializeYearSelector(data, processedData) {
  const yearSelector = document.getElementById('yearSelector');
  const uniqueYears = [...new Set(data.map(item => item.edition))].sort();

  uniqueYears.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelector.appendChild(option);
  });

  yearSelector.addEventListener('change', () => {
    updateDisciplineSelector(data, processedData);
    document.getElementById('disciplineSelector').style.display = 'inline';
  });

  if (uniqueYears.length === 1) {
    yearSelector.dispatchEvent(new Event('change'));
  }
}

function updateDisciplineSelector(data, processedData) {
  const year = document.getElementById('yearSelector').value;
  const disciplineSelector = document.getElementById('disciplineSelector');
  disciplineSelector.innerHTML = '';
  const filteredData = data.filter(item => item.edition === year);
  const uniqueDisciplines = [...new Set(filteredData.map(item => item.sport))].sort();

  uniqueDisciplines.forEach(discipline => {
    const option = document.createElement('option');
    option.value = discipline;
    option.textContent = discipline;
    disciplineSelector.appendChild(option);
  });

  disciplineSelector.addEventListener('change', () => {
    updateEventSelector(data, processedData);
    document.getElementById('eventSelector').style.display = 'inline';
  });

  if (uniqueDisciplines.length === 1) {
    disciplineSelector.dispatchEvent(new Event('change'));
  }
}

function updateEventSelector(data, processedData) {
  const year = document.getElementById('yearSelector').value;
  const discipline = document.getElementById('disciplineSelector').value;
  const eventSelector = document.getElementById('eventSelector');
  eventSelector.innerHTML = '';
  const filteredData = data.filter(item => item.edition === year && item.sport === discipline);
  const uniqueEvents = [...new Set(filteredData.map(item => item.event_title))].sort();

  uniqueEvents.forEach(event => {
    const option = document.createElement('option');
    option.value = event;
    option.textContent = event;
    eventSelector.appendChild(option);
  });

  eventSelector.addEventListener('change', () => {
    filterData(data, processedData);
  });

  if (uniqueEvents.length === 1) {
    eventSelector.dispatchEvent(new Event('change'));
  }
}

function filterData(data, processedData) {
  const year = document.getElementById('yearSelector').value;
  const discipline = document.getElementById('disciplineSelector').value;
  const event = document.getElementById('eventSelector').value;

  let filteredData = data.filter(item =>
    item.edition === year &&
    item.sport === discipline &&
    item.event_title === event
  );

  visualizeEvent(filteredData, data, processedData);
}

function visualizeEvent(eventData, allData, processedData) {
  const vizContainer = document.getElementById('visualization');
  const performanceMetricsContainer = document.getElementById('performanceMetrics');
  const sourceContainer = document.getElementById('sourceContainer');
  const additionalInfoContainer = document.getElementById('additionalInfo');
  vizContainer.innerHTML = '';
  performanceMetricsContainer.innerHTML = '';
  sourceContainer.innerHTML = '';
  additionalInfoContainer.innerHTML = '';

  if (eventData.length === 0) {
    vizContainer.innerHTML = `<p>No data available for the selected filters.</p>`;
    return;
  }

  const columns = getRelevantColumns(eventData);
  if (!columns.performance) {
    vizContainer.innerHTML = `<p>No performance metrics available for this event.</p>`;
  }

  const top3 = eventData.filter(item => item.pos <= 3).sort((a, b) => a.pos - b.pos);
  const eventTitle = `${eventData[0].edition} ${eventData[0].sport} - ${eventData[0].event_title}`;

  createPodiumVisualization(top3, columns.performance, columns.competitor, columns.noc, eventTitle);
  displayPerformanceMetrics(eventData, columns.performance);
  displaySource(eventData);

  const event = eventData[0].event_title;
  const additionalInfo = processedData[event];
  //displayAdditionalInfo(additionalInfoContainer, additionalInfo);
}

function displayAdditionalInfo(container, info) {
  if (info.isNewEvent) {
    container.innerHTML = '<p>First time event went on.</p>';
  } else if (info.lastRecord) {
    container.innerHTML = `<p>Last Olympic record: ${info.lastRecord} by ${info.lastRecordHolder}</p>`;
  } else {
    container.innerHTML = `<p>Last winner: ${info.lastWinner}</p>`;
  }
}

function getRelevantColumns(eventData) {
  const sample = eventData[0];
  const columns = {};

  if ('performance_combined' in sample) {
    columns.performance = 'performance_combined';
  }

  if ('athlete_combined' in sample) {
    columns.competitor = 'athlete_combined';
  }
  if ('noc' in sample) {
    columns.noc = 'noc';
  }

  return columns;
}

function createPodiumVisualization(top3, valueColumn, competitorColumn, nocColumn, eventTitle) {
  const svgWidth = 900;  // Increased width
  const svgHeight = 400;  // Increased height
  const podiumWidth = 120;  // Increased podium width
  const podiumHeight = [200, 150, 100];  // Increased podium heights
  const colors = ["gold", "silver", "#cd7f32"];

  const svg = d3.select("#visualization")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

  // Add a title
  svg.append("text")
    .attr("x", svgWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "24px")
    .attr("font-weight", "bold")
    .text(eventTitle);

  // Define the x positions to center the first place and place second and third on the sides
  // Define the x positions to center the first place and place second and third on the sides
  const xPositions = [
    svgWidth / 2 - podiumWidth / 2, // First place in the middle
    svgWidth / 2 - podiumWidth * 1.5 - 30, // Second place on the left
    svgWidth / 2 + podiumWidth / 2 + 30 // Third place on the right
  ];

  podiumHeight.forEach((height, i) => {
    svg.append("rect")
      .attr("x", xPositions[i])
      .attr("y", svgHeight - height - 50)
      .attr("width", podiumWidth)
      .attr("height", height)
      .attr("fill", colors[i])
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("filter", "drop-shadow(2px 2px 2px gray)");
  });

  // Append the text for the participants
  top3.forEach(d => {
    if (d.pos >= 1 && d.pos <= 3) {
      svg.append("text")
        .attr("x", xPositions[d.pos - 1] + podiumWidth / 2)
        .attr("y", svgHeight - podiumHeight[d.pos - 1] - 60)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16px")
        .text(`${d[competitorColumn]}`);
      
      svg.append("text")
        .attr("x", xPositions[d.pos - 1] + podiumWidth / 2)
        .attr("y", svgHeight - podiumHeight[d.pos - 1] - 30)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "14px")
        .text(`${d[valueColumn]}`);

      const isoCode = window.nocToIso[d[nocColumn]] || d[nocColumn].toLowerCase();

      svg.append("image")
        .attr("xlink:href", `https://flagcdn.com/32x24/${isoCode}.png`)
        .attr("width", 32)
        .attr("height", 24)
        .attr("x", xPositions[d.pos - 1] + podiumWidth / 2 - 16) // Center the flag
        .attr("y", svgHeight - podiumHeight[d.pos - 1] - 130);

      svg.append("text")
        .attr("x", xPositions[d.pos - 1] + podiumWidth / 2)
        .attr("y", svgHeight - podiumHeight[d.pos - 1] - 90)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "14px")
        .text(d[nocColumn]);
    }
  });
}



function displayPerformanceMetrics(eventData, performanceColumn) {
  const performanceMetricsContainer = document.getElementById('performanceMetrics');
  const performanceData = eventData.map(d => d[performanceColumn]);
  //performanceMetricsContainer.innerHTML = `<p>Performance Metrics: ${performanceData.join(', ')}</p>`;
}

function displaySource(eventData) {
  const sourceContainer = document.getElementById('sourceContainer');
  const resultIds = eventData.map(d => d.result_id);
  const uniqueResultIds = [...new Set(resultIds)];
  const sourceLinks = uniqueResultIds.map(id => `<a href="https://www.olympedia.org/results/${id}" target="_blank">Source</a>`).join(', ');

  sourceContainer.innerHTML = `<p>${sourceLinks}</p>`;
}

function selectRandomOptions(data, processedData) {
  const yearSelector = document.getElementById('yearSelector');
  const disciplineSelector = document.getElementById('disciplineSelector');
  const eventSelector = document.getElementById('eventSelector');

  const uniqueYears = [...new Set(data.map(item => item.edition))];
  const randomYear = uniqueYears[Math.floor(Math.random() * uniqueYears.length)];

  yearSelector.value = randomYear;
  yearSelector.dispatchEvent(new Event('change'));

  const filteredData = data.filter(item => item.edition === randomYear);
  const uniqueDisciplines = [...new Set(filteredData.map(item => item.sport))];
  const randomDiscipline = uniqueDisciplines[Math.floor(Math.random() * uniqueDisciplines.length)];

  disciplineSelector.value = randomDiscipline;
  disciplineSelector.dispatchEvent(new Event('change'));

  const disciplineFilteredData = filteredData.filter(item => item.sport === randomDiscipline);
  const uniqueEvents = [...new Set(disciplineFilteredData.map(item => item.event_title))];
  const randomEvent = uniqueEvents[Math.floor(Math.random() * uniqueEvents.length)];

  eventSelector.value = randomEvent;
  eventSelector.dispatchEvent(new Event('change'));
}
