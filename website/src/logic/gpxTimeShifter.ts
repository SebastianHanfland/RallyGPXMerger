import { default as GpxParser } from 'gpxparser';
import * as gpxbuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import { BaseBuilder, buildGPX } from 'gpx-builder';
import {
    findGPXStartEnd,
    route2route,
    timeShiftInSeconds,
    toLink,
    track2track,
    waypoint2waypoint,
} from './gpxutils.ts';

export function letTimeInGpxEndAt(parsedGpx: string, endTime: string): string {
    const gpx = new GpxParser();
    gpx.parse(parsedGpx);

    const timeshift = timeShiftInSeconds(findGPXStartEnd(gpx)['end'], new Date(endTime));

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
    if (gpx.routes.length) {
        builder.setRoutes(gpx.routes.map((_route) => route2route(_route, timeshift)));
    }
    if (gpx.tracks.length) {
        builder.setTracks(gpx.tracks.map((_track) => track2track(_track, timeshift)));
    }
    if (gpx.waypoints.length) {
        builder.setWayPoints(gpx.waypoints.map((_waypoint) => waypoint2waypoint(_waypoint, timeshift)));
    }
    return buildGPX(builder.toObject());
}
