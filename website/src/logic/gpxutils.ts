import * as gpxparser from 'gpxparser';
import * as gpxbuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import { default as GpxParser, MetaData, Route, Track, Waypoint } from 'gpxparser';
import * as date from 'date-and-time';
import { BaseBuilder, buildGPX } from 'gpx-builder';

export class SimpleGPX extends GpxParser {
    metadata: MetaData;
    waypoints: Waypoint[];
    tracks: Track[];
    routes: Route[];
    start: Date = new Date();
    end: Date = new Date();
    timeshift: number = 0;

    public constructor(parsers: (GpxParser | SimpleGPX)[]) {
        super();
        this.metadata = parsers[0].metadata;
        this.waypoints = parsers.flatMap((p) => p.waypoints);
        this.tracks = parsers.flatMap((p) => p.tracks);
        this.routes = parsers.flatMap((p) => p.routes);

        const times = <number[]>[];
        [...this.routes, ...this.tracks].forEach((thing) => {
            times.push(
                ...thing.points.map((_point) => {
                    return new Date(_point.time).getTime();
                })
            );
        });
        if (this.waypoints.length) {
            times.push(
                ...this.waypoints.map((wp) => {
                    return new Date(wp.time).getTime();
                })
            );
        }
        this.start = new Date(Math.min(...times));
        this.end = new Date(Math.max(...times));
    }

    public shift(interval: number) {
        this.start = date.addSeconds(this.start, interval);
        this.end = date.addSeconds(this.end, interval);
    }

    public shiftToArrivalTime(arrival: Date) {
        this.shift(date.subtract(this.end, arrival).toSeconds());
    }

    public shiftToDepartureTime(departure: Date) {
        this.shift(date.subtract(this.start, departure).toSeconds());
    }

    public toString() {
        // this is an expensive operation
        const builder = new BaseBuilder();
        const m = this.metadata;
        builder.setMetadata(
            new gpxbuilder.Metadata({
                name: m.name,
                desc: m.desc,
                time: m.time,
                link: toLink(m.link),
            })
        );
        if (this.routes.length) {
            builder.setRoutes(this.routes.map((_route) => route2route(_route, this.timeshift)));
        }
        if (this.tracks.length) {
            builder.setTracks(this.tracks.map((_track) => track2track(_track, this.timeshift)));
        }
        if (this.waypoints.length) {
            builder.setWayPoints(this.waypoints.map((_waypoint) => waypoint2waypoint(_waypoint, this.timeshift)));
        }
        return buildGPX(builder.toObject());
    }
}

export function toLink(link: string | gpxparser.Link): gpxbuilder.Link | undefined {
    // @ts-ignore
    if (typeof link === 'string') {
        return new gpxbuilder.Link(link, {});
    } else if (!Object.keys(link).length) {
        return undefined;
    } else if (!('href' in link)) {
        return undefined;
    } else {
        return new gpxbuilder.Link(link.href, {
            text: link.text,
            type: link.type,
        });
    }
}

export function point2point(_point: gpxparser.Point, timeshift: number = 0): gpxbuilder.Point {
    return new gpxbuilder.Point(_point.lat, _point.lon, {
        ele: _point.ele,
        time: date.addSeconds(new Date(_point.time), timeshift),
    });
}

export function track2track(_track: gpxparser.Track, timeshift: number = 0): gpxbuilder.Track {
    // gpx-builder tracks can have segments, but gpx-parser ones do not
    return new gpxbuilder.Track(
        [new gpxbuilder.Segment(_track.points.map((_point) => point2point(_point, timeshift)))],
        {
            name: _track.name,
            cmt: _track.cmt,
            desc: _track.desc,
            src: _track.src,
            link: toLink(_track.link),
            number: Number(_track.number),
            type: _track.type,
        }
    );
}

export function route2route(_route: gpxparser.Route, timeshift: number = 0): gpxbuilder.Route {
    // you cannot get the properties of a type because at compile time or runtime it just might be a whole different fuck-up.
    // this is like an Exclude or Omit<T, K> but as an object rather than a type
    const { link, number, points, distance, elevation, slopes, ...without } = _route;

    return new gpxbuilder.Route({
        ...without,
        rtept: _route.points.map((_point) => point2point(_point, timeshift)),
        // @ts-ignore
        link: toLink(_track.link),
        number: Number(_route.number),
    });
}

export function waypoint2waypoint(
    _waypoints: gpxparser.Waypoint,
    // @ts-ignore
    timeshift: number = 0
): gpxbuilder.Point {
    throw new Error("whoops, haven't seen one of those before!?");
}
