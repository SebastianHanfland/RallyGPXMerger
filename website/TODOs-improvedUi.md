### Fix List
- [x] Upload of Segment(s) triggers calculation
- [x] No segment select for simple track
- [x] Track info for simple track
- [x] Bug when uploading?
- [x] Width of sidebar
- [x] Map Focus when entering page
- [ ] Directly create a break somewhere
- [ ] Integrate toilet display
- [ ] Aborting/Deleting a planning
- [x] Maybe renaming segments for simple track? -> No
- [x] Space to the bottom so that the dropdown looks fine
- [x] When initally starting, having a sidebartab selected
- [x] Calculate when speed changes
- [x] Calculate when expansion changes
- [x] Download only a single pdf/gpx
- [x] No N.N., maybe allow to name the track anyways -> title on display later
- [x] Labels on text fields for simple track
- [x] Linking to setting date -> being adjusted

### Optional
- [ ] Display height profile of track


### Things to integrate

-[x] speed settings for single gpx file on the dropdown on the gpx tab
-[x] Other settings via a dialog, only construction was missing and is now on the settings page
-[x] Api keys somewhere and then also a feedback if the automatic fetching did not work
-[ ] Using Toasts for this to inform the user about failing API Calls?
-[x] Import Export maybe also on the document table
    -[x] There you can download everything you need
-[x] Map mode changes
    -[x] Integrated in the map
-[ ] Points maybe via dialog or extra tab, or accordion?
-[x] Construction sites and others
-[x] Track name (and ensured creation) for single track
- [x] Doing the magic only for small demonstrations and turning it of.
  - [x] Still having one "Do the magic" button available
  - [ ] Optimizing the magic
    - [ ] It should be way faster.

### Improvement
- [ ] Overall styling, making it beautiful, Maybe asking Dennis about it
- [ ] Edit of Breaks, changing time or text or whatever
  - [ ] Text etc as title when hovering over it
-[x] .... Having numbers and (/) etc in the tab name to give the user a better feeling for what happens
-[x] Map interactions, via floating buttons
- [ ] Being able to change the color (by randomly clicking?)
-[x] Having an icon which signals that some background processes are working
-[ ] break management
    -[ ] It should be possible to assign a toilet icon and location
    - [ ] adding a break comes with the question for further information
-[x] Warning section or Toast due to missing things
-[ ] More interaction on the map,
    -[ ] e.g. right click on segment to add it to a route or so
    -[x] Splitting a route into two parts via the Map, with a right click
    -[ ] Other feedback from Leo
-[x] Having a mode for only a simple demonstration
    -[ ] No tracks
    -[ ] segments can be reordered and breaks added
-[ ] More permanent overwrite of streetnames oder modification
-[ ] Validation for the document creation
-[ ] Initial map location via ip address or such
-[ ] Having a smooth user experience when using the tool
-[x] Maybe one button to trigger a clean creation
-[ ] Maybe improve handling on the nodes
-[ ] Settings for start time communication or such not having it in code
  - [ ] As additional parameters for each track
  - [ ] An overview of the start times is missing
    - [ ] Use the iframe solution (Table and Map)
    - [ ] They should easily be able to link from the current planner view
    - [ ] I want direct feedback to what I would be publishing etc
-[ ] Button or example on copying something for an iframe
-[ ] Having ::: left of line that can be shifted
-[ ] ? Adding Toasts once the needed actions is done
-[ ] Smooth the starting way and maybe rework the menu and the way to it
-[ ] A list of warnings per track, or also one to display that the arrival date was not yet set
    - [ ] Either on the map or as bubbles
- [x] a proper context menu on the tracks,
    - [x] split in dialog
    - [ ] gpx segment, add to track X
    - [ ] all the other ones from the list as well
      - [ ] delete
      - [ ] revert
      - [ ] download
      - [ ] replace segment
- [ ] Performance should be ok for a full Sternfahrt
- 

### Backend like improvement

-[ ] Being able to save the planning (just as such send an json)
-[ ] Also being able to publish it
    -[ ] With some settings
    -[ ] Maybe favicon
    -[ ] Name
    -[ ] Description
    -[ ] Links
    -[ ] As Table or as Cards on map
-[ ] Allowing to compare between multiple plannings easily
- [ ] Open file directly in gpx.studio via the url attribute:
  - [ ] requires hosting of gpx files, but if we have an endpoint it should be working then :)
