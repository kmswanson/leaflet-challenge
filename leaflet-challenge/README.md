# Module 15 Challenge: Leaflet

For this module challenge, the objective was to use leaflet to create a map that shows earthquake activity represented as circles onto the map.
This was achieved first by calling an api using d3.json to get the earthquake information from earthquake.usgs.gov. This would allow for the data to be pulled into our leaflet map so that it could be stylized for display.
The function called dataColor uses if, else if, else to visualize the depth of the earthquakes using color to represent the depth the earthquake occurred at.
Similarly, the function radiusSize uses the magnitude of the earthquake to provide scale for the circles based on the magnitude strength.

The most complicated part of this challenge for me was pointToLayer, and onEachFeature. I relied heavily on past lectures to help me find a way though getting the information to display properly.

This module challenge was an excellent way to prepare for Project 3, as that project relied heavily on leaflet and being able to use a geoJSON to properly visualize onto a map.

Referenced the Cloud Recordings of past class sessions to complete this challenge.

index.html
logic.js
style.css
README.md
