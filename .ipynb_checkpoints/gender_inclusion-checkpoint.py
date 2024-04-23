import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
import pycountry
from matplotlib.colors import LinearSegmentedColormap

# Load your datasets
athletes = pd.read_csv('data/dataset_olympics.csv')
gdf_world = gpd.read_file('data/countries.geojson')

# Data Manipulation: Calculate the number of female and male athletes per country
athletes['count'] = 1
grouped_athletes = athletes.groupby(['Team', 'Sex']).count()['count'].unstack().fillna(0)
grouped_athletes.columns = ['female_count', 'male_count']

# Add a new column for the female to male ratio
grouped_athletes['female_male_ratio'] = grouped_athletes['female_count'] / grouped_athletes['male_count']

# Standardize country names using pycountry
def standardize_country_names(country_name):
    try:
        return pycountry.countries.lookup(country_name).name
    except:
        return None

grouped_athletes.index = grouped_athletes.index.map(standardize_country_names)

# Merge with GeoDataFrame
merged_gdf = gdf_world.set_index('ADMIN').join(grouped_athletes)

# Plotting
fig, ax = plt.subplots(1, 1, figsize=(15, 10))
cmap = LinearSegmentedColormap.from_list("", ["red", "white", "blue"])
merged_gdf.dropna(subset=['female_male_ratio']).plot(column='female_male_ratio', ax=ax, legend=True, cmap=cmap,
                legend_kwds={'label': "Female to Male Athlete Ratio",
                             'orientation': "horizontal"})
plt.show()
