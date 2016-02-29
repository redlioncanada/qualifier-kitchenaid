#WP Qualifier Tool

##Development
1. Run
```
npm install
```
To install all the development dependencies

2. Run 
```
bower install
```
To install all the app dependencies

3. To build and run the app, simply run 
```
gulp
```
BrowserSync will watch for any changes in the files and will reload your browser to update to the latest changes.
Current errors during install occur due to the NodeJS version and lib-sass installation order. 

##SCSS Methodology & Brand Theming

Uses Bootstrap-Sass for clearer integration with AngularJS. The SCSS files have a separation of structure and styling due to the fact multiple brands will be used for this app, but the structure will remain (mostly) the same. There are the initial setup files with general styling and the SCSS mixins for re-usable pieces of code and handy functions outside of what is include in Bootstrap, as well as the general Bootstrap parameters. The general app styles compile to qualifier-app.css

Each brand has it's own palette, fonts, and other individual files to adjust the theme of the app to the specific brand. Each brand theme compiles to it's own CSS file: maytag.css, kitchenaid.css, whirlpool.css, which will be set up to be included in the app based on the app instance in AngularJS. Maytag version will pull the Maytag CSS file, etc.


##Locale  
To change app locale, open index.html and change the lang attribute on the html tag to either
```
lang="en" 
```
or  
```
lang="fr"
```
