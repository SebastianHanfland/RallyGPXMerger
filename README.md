# RallyGPXMerger
A web tool to merge GPX tracks for big bike rallies written in React and TypeScript. Once the code is pushed to main, it is deployed.

## Current deployment
https://sebastianhanfland.github.io/RallyGPXMerger/

## Functionality
For organizing a rally, it is helpful to automate the time calculation for the different routes.

### Workflow
* Uploading gpx segments into the browser
* Defining routes based on segments, including breaks
* Setting the target time for the final point
* Then starting the calculation of the times
* Downloading/Saving the resulting routes

## Project structure

* ```.github```: Files for deployment via GitHubPages
* ```docs```: Code Docs based on arc42
* ```testdata```: Example Gpx files
* ```website```: Code (React + vite project)