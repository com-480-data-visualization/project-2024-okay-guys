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
The dataset for our Olympic Games analysis is obtained from Kaggle, a leading platform in the machine learning and data analysis community. It compiles information on the Olympic Games, boasting a perfect "usability" score of 100%, indicating high data quality in terms of completeness, credibility, and compatibility. This score underscores the dataset's reliability, as evidenced by its extensive download count within the data science community, reflecting its value in analysis and visualization efforts for our Olympic Games study.

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
- **Performance Metrics**: Filters allow users to sift through data by Olympic year, sport, or event, displayed via intuitive graphs.
- **Historical Timeline**: An engaging timeline highlighting the pivotal moments in Olympic history.
- **Athletic Evolution**: Visualizations reveal how the typical athlete profile has changed over the decades.
- **Sporting Discipline**: An exploration of the evolving Olympic program.
- **Gender Inclusion**: Charts showcasing the progress in female participation in the Games.

Our goal is to create an immersive experience where visualization acts as both an educational tool and a lens into the Olympic legacy.

### Exploratory Data Analysis

### Related work
