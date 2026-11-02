# Cross-cutting Concepts

## Persistence

At startup, the planner reads its persisted slices from browser
`localStorage`. Redux Toolkit actions update the slices, and the planner store
writes the current source state back after updates.

Necessary information and actions can either be accessed:

#### in a React component

with `useSelector` and `useDispatch` hooks

#### in a function/thunk

https://redux.js.org/usage/writing-logic-thunks

#### createSelector

https://reselect.js.org/api/createselector/

## Storage of gpx tracks

The backend allows a plan's JSON to be retrieved by UUID. The planner stores
uploaded segment data, track compositions, and settings locally; calculated
tracks and display data are derived through selectors rather than being the
authoritative input model.

The API supports public `GET /bike/:id`, `POST /bike/`, token-protected
`PUT /bike/:id`, and token-protected `DELETE /bike/:id/:adminToken` operations.
