# Privacy

Planner source state is stored in the browser's `localStorage` so work can
continue after a browser restart. The user can clear this data from the
browser or reset the planning in the application.

To publish or share a plan, its JSON state and an admin token are uploaded to
the persistence server. The server stores the plan as a JSON file. The token
is used to authorize updates and deletion; public reads remove it from the
returned plan. Users should not put personal data into a plan.

For public sharing you can use the display links.

# Street name resolving and post codes

Street names are resolved through GeoApify map matching and postcodes/districts
through BigDataCloud. Coordinates from the uploaded route data are sent to
these external services when resolving street information.

## [GeoApify](https://www.geoapify.com/)

## [BigDataCloud](https://www.bigdatacloud.com/)
