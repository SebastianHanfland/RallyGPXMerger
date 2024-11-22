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
- [ ] Hovering on track highlights track
- [ ] More help texts
- [ ] Break handling to also create points of interest, customized breaks
- [ ] Start time communication


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
    -[x] No tracks
    -[x] segments can be reordered and breaks added
-[ ] More permanent overwrite of streetnames oder modification
-[ ] Validation for the document creation
-[x] Initial map location via ip address or such
  - [ ] Happens now via one of the gpx tracks
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

#### Integration of the Backend into the FE:

I need: a button to save/update a planning
* There a password needs to be entered
* It is possible to copy a piece of information to have the edit link and the publish link there
* Save and update should go hand in hand
* You get the prompt for the password when you enter it first
A way to display that the person is allowed to edit the planning.

A good way to open a planning and still have the possibility to edit and publish it:

Opening the link -> leads to the display map
* If the password is stored in the localstorage
** Edit Mode is available
* If the password is not stored
  * There is a way to open it in edit mode:
    * Entering password
    * Putting it in the URL

AC:
It is possible to share the published link
It is possible to share the editable link
It is possible to do a copy of something
It is possible to delete the planning, when it is editable -> promp, you really want it?

Is it good to have an end date

2mb -> 100 000
I do not need too much of a limitation there

I need help.
I do not know what is not working. The request things are right but the construction we have for the other side to check, they are wrong
I do not know how to debug or what it means...
Here I have to continue.

Also:
* Loading a planning via its id
* make it editable etc
* Keep the current version thing and still allow to store also in the cloud

## New idea
Having a simple node express backend, which takes the json and stores it on the disk
* loading the json from the backend when opening the url
  * in planning mode
  * in display mode
  * comparisons
* Cleanup and sanity check
### Still to do
* [x] Ensure that the password is not within the backend which is stored
* [ ] Title of the planning
* [ ] Deployment
* [ ] Clean up and sanity check, maybe basic ui tests
* [ ] Notifications Feedback
* [ ] Possible to enter password or have it in the URL to allow editing, or prefilling password
  * [ ] It is also possible to not make it manually possible to enter a password, but it is a uuid
  * [ ] Then having a second link, with editable rights which can be shared
* [ ] Hide UI for editing when the password is not set and it was loaded from the server
* [ ] Resolving the elements even on the initial upload or so
* [x] Fix delete buttons
* [x] add a simple json download button
* [x] Continue planning 


### Next
* [ ] Translate hints to english
* [ ] UI to add breaks via left click
* [ ] Testing for bugs
* [ ] Add a simple gif for simple and complex each
