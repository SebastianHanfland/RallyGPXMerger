# Cross-cutting Concepts

## Persistence

At start of the application, the localstorage is checked for stored information.
If they exist, they are loaded into the redux store.
With each update the redux store is mirrored into the localstorage.

Necessary information and actions can either be accessed:

#### in a React component
with ```useSelector``` and ```useDispatch``` hooks

#### in a function/thunk
https://redux.js.org/usage/writing-logic-thunks

## Storage of gpx tracks

There is a backend that allows to retrieve the full json for a planning.
GPX tracks can reside within the redux store, are cached via their id, or live in the readableTracks
