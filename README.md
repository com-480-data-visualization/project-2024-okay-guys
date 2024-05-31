# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
|Tanguy Declety | 302769 | 
|Léa Blinière | 283670 |
|Louis Duval | 302576 |

[Milestone 1](#milestone-1)

## Milestone 1 (29th March, 5pm)

### Dataset

#### Data Sources and Quality
The [dataset](https://www.kaggle.com/datasets/bhanupratapbiswas/olympic-data/data)  for our Olympic Games analysis is obtained from Kaggle, a leading platform in the machine learning and data analysis community. It compiles information on the Olympic Games, boasting a perfect "usability" score of 100%, indicating high data quality in terms of completeness, credibility, and compatibility. This score highlights the dataset's reliability, as evidenced by its extensive download count within the data science community, reflecting its value in analysis and visualization efforts for our Olympic Games study.

#### Data Content and Scope
Our dataset comprises detailed information on modern editions of the Summer and Winter Olympics, spanning from 1896 to 2016. Notably, it excludes data related to the Tokyo 2021 Games and the Paralympic Games. It offers a comprehensive set of metadata for each participant, including unique identifiers (ID), demographic details (age, height, weight), team affiliations, National Olympic Committee (NOC), Games season (summer or winter), host city, sports, specific events, and, where applicable, medal achievements.

#### Preprocessing
Initial analysis revealed missing data in athlete demographic fields, with rates of 4%, 23%, and 24% for age, height, and weight, respectively. These missing data pose potential challenges for certain analyses outlined in our problematic. Furthermore, our dataset spans a vast historical period marked by significant geopolitical shifts affecting participating countries in the Olympic Games. As countries underwent name changes, fragmentation, or mergers, these factors are crucial for a thorough analysis of Olympic performances.
To address this complexity, external resources like a Wikipedia article detailing Olympic nation evolutions [List of participating nations at the Summer Olympic Games](https://en.wikipedia.org/wiki/List_of_participating_nations_at_the_Summer_Olympic_Games#Name_changes_notes) can guide dataset adjustments. We propose segmenting the dataset into five historical periods: early years, inter-war years, post-war and Cold War era, and recent games. This segmentation will enhance our analysis by accounting for historical shifts in participating countries, offering a nuanced perspective on the Olympic data.

### Problematic
Our visual project on the Olympics aims to clarify and educate on the event's history and evolution through engaging, interactive web tools. We will offer a comprehensive interactive map to trace the host cities over time, highlighting the economic and cultural impacts of the Games. We also intend to display the changes in sporting events and performances across the editions.

From the start in 1896 with 43 events in 10 sports, to over 300 in 49 sports today, our data-driven narrative will cover the expansion and the ripple effects of the Olympics. As we gear up for the Paris Olympics, we'll address a central question: how aware is the public of the Games' historical journey? Our interactive platform is designed to enlighten visitors on this journey, catering to a broad audience including enthusiasts, academics, educators, and the curious public.

Key features of our site include:

- **Interactive Map**: A dynamic global map detailing each Olympic city, linked to a "Performance by Country" analysis for in-depth insights.
- **Performance Metrics**: Filters allow users to shift through data by Olympic year, sport, or event, displayed via intuitive graphs.
- **Historical Timeline**: An engaging timeline highlighting the pivotal moments in Olympic history.
- **Athletic Evolution**: Visualizations reveal how the typical athlete profile has changed over the decades.
- **Sporting Discipline**: An exploration of the evolving Olympic program.
- **Gender Inclusion**: Charts showcasing the progress in female participation in the Games.

Our goal is to create an immersive experience where visualization acts as both an educational tool and a lens into the Olympic legacy.

### Exploratory Data Analysis
The preprocessing and basic statistics are accessible in this [notebook](./EDA.ipynb) at point 3.

### Related work

While the Olympic Games dataset has been extensively utilized for various analyses, often focusing on general trends in medal distribution, athlete demographics, and the overall success of countries. We will still represent such information, however our approach sets itself apart by delving into more specific aspects of the Olympic Games dataset. 
By integrating a dynamic global map, sophisticated performance metrics, an engaging historical timeline, and in-depth explorations of athletic evolution and gender inclusion, we offer users a unique and immersive journey through the Olympics. This approach not only highlights general trends and demographic data but also uncovers the stories and developments behind the Games, making our analysis original and captivating for a broad audience.

Our inspiration for this project comes from an enjoyment of looking at the limits of human performance in sports often represented in mediums such as Youtube videos or TV documentaries as well as a general appreciation for History. Trying to track and display the past events of the Olympic Games like Wars have been documented seemed relevant for us. Hence our will to use maps and timelines to share the Olympic Games history. 


Finally, this dataset is totally new to us three, hence it was never previously explored in our past projects. 

## Milestone 2 (26th April, 5pm)
[Milestone 2](Milestone_2.pdf)

## Milestone 3 (31st May, 5pm) : Technical setup and intended usage 

[Process Book](Okay_Guys.pdf)

### Overview
The idea for our project was born from the media enthusiasm surrounding the 2024 Olympic Games. We realized that, amidst this influx of information about the upcoming Games, few people were truly aware of their history, creation, and evolution over time. Our online research revealed that searching for "history of the Olympics" mainly leads to the Wikipedia page, which, although comprehensive, remains very traditional with a straightforward presentation and often cumbersome tables. The official Olympic Games website also dedicates very little space to their history.

Our objective is to make the history and evolution of the Olympic Games accessible to everyone through engaging and visually appealing animations. This project proved to be vast, covering several important aspects. We explored the distribution of host cities worldwide with an interactive map, traced the evolution of Olympic venues with a dynamic timeline, and showcased the increase in the number of disciplines, from 10 to nearly 49 as we approach the Paris 2024 Games. Additionally, we highlighted the evolution of women’s participation in sports competitions and analyzed sports performances over time.

These elements have been integrated to create an interactive, aesthetically pleasing, and user-friendly website, aiming to inform a broad audience that the Olympic Games are much more than just a sports competition. They are a showcase of our world in many aspects.

## Table of Contents
1. [Installation](#installation)
2. [Project Structure](#project-structure)
3. [Usage](#usage)

## Installation

### Prerequisites
Before you begin, ensure you have met the following requirements:
- Python 3.8 or higher
- The following Python libraries:
  - pandas
  - geopandas
  - matplotlib
  - pycountry
  - requests
  - BeautifulSoup (beautifulsoup4)
  - deep_translator
  - aiohttp
  - nest_asyncio
  - csv
- D3.js for interactive visualizations

### Steps
**Clone the repository:**
   ```bash
   git clone https://github.com/com-480-data-visualization/project-2024-okay-guys.git
   cd project-2024-okay-guys

## Project Structure
```
project-2024-okay-guys/
│
├── data/                    # Data files directory
│   ├── countries.geojson
│   ├── data.csv
│   ├── dataset_olympics.csv # Dataset Kaggle 
│   ├── host_cities_lon_lat.csv  # Dataset longitude and latitude of host cities 
│   ├── iso_country.json # Correspondance ISO code and Country name 
│   ├── medal_distribution.csv # Distribution of medal by type, year and country
│   ├── summer_olympics.csv # Dataset scrapped from wikipedia
│   └── winter_olympics.csv # Dataset scrapped from wikipedia
│   └── noc_to_iso_mapping.json # Dataset scrapped from wikipedia
│
├── images/                  # Image files directory
│   ├── lea.jpg
│   ├── louis.jpg
│   ├── olympic_symbole.png # Logo of our page
│   └── tanguy.jpeg
│
├── notebook/                # Jupyter notebooks and scripts directory
│   ├── gender_inclusion-checkpoint.py
│   ├── gender_representation-checkpoint.ipynb 
│   ├── preprocessing_data_gender_medals.ipynb
│   ├── scrapping_historical_data.ipynb
│   └── scrapping_olympdia_data.ipynb
│
├── pages/                   # HTML pages directory
│   ├── about_us.html
│   ├── athletics.html
│   ├── disciplines_viz.html
│   ├── gender_viz.html
│   ├── history.html
│   ├── medals_viz.html
│   ├── olympics.html
│   ├── podium.html
│   └── swimming.html
│
├── scripts/                 # JavaScript scripts directory
│   ├── history/
│   │   ├── data_timeline.js
│   │   ├── disciplines_viz.js
│   │   ├── gender_viz.js
│   │   ├── medals_viz.js
│   │   └── timeline.js
│   ├── index/
│   │   ├── initializeMap.js
│   │   ├── mapdata.js
│   │   └── worldmap.js
│   └── olympics/
│       ├── medals.js
│       ├── podium.js
│       ├── running.js
│       └── swimming.js
│
├── styles/                  # CSS styles directory
│   ├── about_us.css
│   ├── history.css
│   ├── index.css
│   └── olympics.css
│
├── index.html               # Main HTML file
└── README.md                # Project README file
└── milestone2.pdf           # Milestone 2
└── Okay_Guys.pdf            # Process Book


```

## Usage

### Accessing the Website
- Open your web browser and go to `https://com-480-data-visualization.github.io/project-2024-okay-guys/`.
