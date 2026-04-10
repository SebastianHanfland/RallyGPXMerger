# RallyGPXMerger
A web tool to merge GPX tracks for big bike rallies written in React and TypeScript, with a simple backend storing JSON files.

## Current deployment

The current version of this tool is deployed here: 
https://www.sternfahrtplaner.de/

You can find an example of a more complicated planning here: 
https://www.sternfahrtplaner.de/?section=gps&planning=ce4e62a5-3b73-4fa1-80e3-d66d687c2439
![Sketch](./docs/images/planner.png)


## Why does this tool exist
When planning a bigger bike demonstration or rally it is a lot of work to not only decide about the routes. You also have to
* consider the timing, breaks, confluences of tracks
* communicate your tracks with officials
* communicate your tracks with participants
* apply changes and do all of it again


To ease these processes, this tool was developed to have an easy interface to the planning and reduce the manual work or copying information.
This tool does not provide any route planning because this is a common problem which is not unique to organizing rallies.
During the development it showed, that also for smaller bike demonstration it can help.
Therefore, now there are two modes of planning: one for a simple "line" demonstration and another one for more complex "tree" ones 

![Sketch](./docs/images/englishSketch.svg)

### General functionality
* Automatic time calculation for the tracks
  * Setting the speed in general and for segments
  * Taking the number of participants into account
* Preview of the resulting demonstration with a time slider
* Combining segments and breaks to a track
* Replace segments in tracks when changes are required
* Cut segments via a left click into pieces (e.g. to add a break in a track)
* Choose what to display on the map in the planner
  * Filter for segments or tracks
  * Toggle segments, tracks and others
* Live view with integration of the criticalMaps API
  * When participant use the CriticalMaps App, their location is displayed on the map
* Automatic resolving of street names and post codes
* Creation of PDF files containing a detailed overview of the streets and times
* Allow to publish the plan as a map (https://www.sternfahrtplaner.de/?display=ce4e62a5-3b73-4fa1-80e3-d66d687c2439)
![Sketch](./docs/images/map.png)
* Allow to publish the plan as a table (e.g. to integrate on your website) (https://www.sternfahrtplaner.de/?table=ce4e62a5-3b73-4fa1-80e3-d66d687c2439)
![Sketch](./docs/images/table.png)
* An overview of all nodes, where track come together
* An overview of all segments on all tracks to check if the setup is right
* Checking for gaps
* Adding extra gathering points/entry points which have a time to be published, with a buffer and rounding, calculated from the current planning

### Simple ("Line")

The workflow for a simple demonstration

* Upload gpx segments into the browser
* Reorder them via drag and drop
* Integrate breaks into the track
* Name the planning and choose settings
* Upload the planning
* Share or publish the planning in form of PDF, or links, or iframes, as map or as table 

### Complex ("Tree")

The workflow for a complex demonstration

* Upload gpx segments into the browser
* Create tracks
* Add segments to the tracks (segments can be used multiple times, when the different branches join)
* Integrate breaks into the track
* Name the planning and choose settings (e.g. rounding of start times)
* Upload the planning
* Share or publish the planning in form of PDF, or links, or iframes, as map or as table

#### Behavior at nodes

For trying out the behaviors, you find this simple planning here: https://www.sternfahrtplaner.de/?section=gps&planning=f9043eb9-2394-4d78-be27-481e96654411

##### Default behavior

Without any further setting, at a node the bigger group goes first, and then the smaller one(s) add behind.

![Sketch](./docs/images/Confluence.png)

##### Custom behavior

The tool allows to alter this behavior:
* Via settings priorities can be set (the higher the priority, the earlier a branch finishes)
* At each node the behavior can be specified:
  * Altering the order
  * Let the branches join at the same time

When two or more branches join at the same time, the size is not adopted.
The tool is based on a very simple simulation approach.
For the planning and the execution the times of the head of branches are important.
A more sophisticated approach would require detailed participant numbers, which are difficult to get.

### Comparison

Different plannings can be compared, to see the differences between them. Therefore, the planning ids have to be listed, like in this example:
Optionally the color for the plannings can be specified in hex codes, or altered in the comparison itself

https://www.sternfahrtplaner.de/?comparison=ce4e62a5-3b73-4fa1-80e3-d66d687c2439,2bf9d574-e3eb-4eb8-8759-762c34405160&colors=644ecf,befa2a

## Project structure

* ```.github```: Files for deployment via GitHubPages
* ```docs```: Code Docs based on arc42
* ```server```: Code (Simple nodejs server)
* ```testdata```: Example Gpx files
* ```website```: Code (React + vite project)

## German naming sketch

![Sketch](./docs/images/germanSketch.svg)

## Acknowledgement

This tool would not be possible without external services which ease the creation of GPX files or retrieval of geo-data.
* [GPX Studio](https://www.gpx.studio/)
* [brouter](http://brouter.de/brouter-web)
* [GeoApify](https://www.geoapify.com/)
* [BigDataCloud](https://www.bigdatacloud.com/)
* [CriticalMaps](https://github.com/criticalmaps/)
