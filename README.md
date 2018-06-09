# SkiCamp
Fully implemented front to back website showcasing different places to ski/snowboard:
https://powerful-bastion-13917.herokuapp.com

This repo contains the main source code in creating this website. It does not include node_modules containing all the different packages.
The dependancies/package list are in the package.json file.

There are two environment variables that are required for the website to be fully functional:
    1) MongoLab database url
    2) Google Geocoder api key
    
These two sensitive information are kept hidden for security purposes and if you want to play with the code then you need to
setup your own database and connect it in app.js and get your own geocoder api key and set it up in routes/skigrounds.js files
