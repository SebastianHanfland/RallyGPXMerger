# Runtime View

The tool is a vite based React application. It uses redux for state handling.
At the start the localstorage of the browser is checked for a previous session.
The current status is mirrored into the localstorage.

## Workflow

- gpx segment files are uploaded
- extra information for amount of people is added
- resulting tracks are entered
- with a button click the calculation starts
- the result can be seen on a map
- the result can be saved

## Data storage
The state of the application is present in redux (can be seen with the redux dev tools browser extensions)
User interactions change this state. Every change is mirrored into the localstorage.

When the website is loaded, the redux state is initialized by the values in the localstorage.

The merge calculation happens in a [thunk](https://redux.js.org/usage/writing-logic-thunks) where the redux state first is accessed, then values are calculated and finally stored in the redux state again.

Some values, especially used for the map, are mirrored in a normal global variable, to prevent [prop drilling](https://kentcdodds.com/blog/prop-drilling) in the logic.

## Map simulation

To simulate the rally on the map, a timer is used. The TimeSlider component represents the time.
Start and end of tracks are calculated and then scaled with the numbers of the slider.
Thus, the value stored is only a number which results in a percentage.
The length of a track/group is calculated via the same parameter as in the merge calculation.
An interpolation between the GPX points happen, to make a smoother experience.

## Street resolving

The gpx segments are used to resolve the street names and their post codes.
Then the waypoints are grouped by street name and post code.
The redux store and a mirror in the local storage are used for persistence.
As long as the data is not cleared, the results for the post codes are cached.
