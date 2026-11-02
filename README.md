# RallyGPXMerger
A web tool to plan big bike rallies from existing GPX route segments, written in React and TypeScript, with a simple backend storing JSON files.

_"Planning a Sternfahrt becomes really easy"_ (Sternfahrt: German for a big star shaped bike demonstration)

Quote: Long-time Power User LeTaPe


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
* Start a new plan, continue an unfinished plan, or load a previously downloaded plan from a JSON file.
* Switch between English and German and send feedback from the planner.
* Automatic time calculation for the tracks
  * Set a general speed or individual speeds for segments.
  * Take participant numbers, participant delays, buffers, breaks, and joins into account.
* Preview the resulting demonstration with a time slider and selectable map layers.
  * Filter and toggle segments, tracks, nodes, breaks, entry points, points of interest, and construction sites.
* Upload, reorder, filter, download, remove, replace, reverse, and split GPX segments.
* Combine segments and breaks into tracks and edit the resulting track information.
* Automatically resolve street names, districts, and postcodes.
  * Highlight unknown streets and manually correct street names, districts, and postcodes.
  * Check plans for gaps and other incomplete or inconsistent settings.
* Add points of interest and timed entry points with configurable buffers and rounding.
* Add construction-site GPX files as map overlays.
* Download calculated tracks and source segments as GPX files, and export street information as CSV or PDF.
* Create a copy of a plan for later import or further editing.
* Live view with integration of the criticalMaps API
  * When participants use the CriticalMaps App, their location is displayed on the map.
* Creation of PDF files containing a detailed overview of the streets, breaks, entry points, nodes, and times.
* Allow to publish the plan as a map (https://www.sternfahrtplaner.de/?display=ce4e62a5-3b73-4fa1-80e3-d66d687c2439)
![Sketch](./docs/images/map.png)
* Allow to publish the plan as a table (e.g. to integrate on your website) (https://www.sternfahrtplaner.de/?table=ce4e62a5-3b73-4fa1-80e3-d66d687c2439)
![Sketch](./docs/images/table.png)
* Allow to publish the plan as a vertical table (e.g. to integrate on your website) (https://www.sternfahrtplaner.de/?vTable=6efaf495-a9f6-4308-87e1-fd5d2c8e7911)
![Sketch](./docs/images/verticalTable.png)
* Share plans through public links and embed the map or tables in other websites.
* Overview tools for tracks, nodes, branches, arrivals, entry points, and the overall flow of a complex plan.

### Simple ("Line")

Simple mode creates one ordered track from the uploaded segments. It is intended for demonstrations without branching or merging routes.

The workflow for a simple demonstration:

* Start a new Simple plan from the wizard and upload GPX segments into the browser.
* Reorder segments via drag and drop and edit them by replacing, reversing, splitting, or removing them.
* Integrate breaks into the track and configure its title, start and arrival times, buffer, participant count, speed, and participant delay.
* Use the planning checks to inspect gaps, unknown streets, points of interest, and planner settings.
* Download the calculated track or source segments, export the street information, or upload the planning to the server.
* Share or publish the planning in the form of a PDF, links, or iframes, as a map, table, or vertical table.

### Complex ("Tree")

Complex mode creates several named tracks that may branch, reuse segments, and merge at nodes. It is intended for demonstrations with multiple groups or routes.

The workflow for a complex demonstration:

* Start a new Complex plan from the wizard and upload GPX segments into the browser.
* Create, name, reorder, and filter tracks.
* Add segments to tracks. Segments can be used multiple times when different branches join.
* Integrate breaks into tracks and configure track-specific people, speeds, buffers, and timing.
* Name the planning and configure global settings such as arrival dates, start times, and rounding.
* Add entry points with a published arrival time, buffer, and rounding calculated from the current planning.
* Review gaps, unknown streets, points of interest, start names and times, track arrivals, node settings, and public links in the overview.
* Inspect the plan with the track overview, node overview, and flow overview.
* Download or upload the planning and share or publish it in the form of PDFs, links, or iframes, as a map, table, or vertical table.

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

### Starting, continuing, and sharing plans

The start page offers three planning actions:

* **Start a plan** opens the mode selection for a new Simple or Complex plan. Starting over warns before replacing an existing plan.
* **Continue a plan** returns to the current planning when one is already in progress.
* **Load a plan** imports a previously exported JSON planning. Loading over an existing planning asks for confirmation first.

Plans can be saved to the server, downloaded as a copy, imported again, and shared through generated public links. Public views are available as an interactive map, a regular table, or a vertical table, including iframe-friendly URLs.

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
