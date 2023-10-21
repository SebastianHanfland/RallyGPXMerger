import { default as GpxParser } from 'gpxparser';
import * as gpxbuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import { buildGPX, BaseBuilder } from 'gpx-builder';

import { route2route, toLink, track2track, waypoint2waypoint } from './gpxutils.ts';

export function mergeGpxs(first: string, second: string, timeshift: number = 0): string {
    const gpx = new GpxParser();
    gpx.parse(first);
    const other = new GpxParser();
    other.parse(second);

    const builder = new BaseBuilder();
    const meta = gpx.metadata;
    builder.setMetadata(
        new gpxbuilder.Metadata({
            name: meta.name,
            desc: meta.desc,
            time: meta.time,
            link: toLink(meta.link),
        })
    );
    const routes = [...gpx.routes, ...other.routes];
    if (routes.length) {
        builder.setRoutes(routes.map((_route) => route2route(_route, timeshift)));
    }
    const tracks = [...gpx.tracks, ...other.tracks];
    if (tracks.length) {
        builder.setTracks(tracks.map((_track) => track2track(_track, timeshift)));
    }
    const waypoints = [...gpx.waypoints, ...other.waypoints];
    if (waypoints.length) {
        builder.setWayPoints(waypoints.map((_waypoint) => waypoint2waypoint(_waypoint, timeshift)));
    }
    return buildGPX(builder.toObject());
}
