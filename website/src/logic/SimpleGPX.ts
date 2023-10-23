import * as gpxBuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import GpxParser, { Link, MetaData, Point, Route, Track, Waypoint } from 'gpxparser';
import date from 'date-and-time';
import { BaseBuilder, buildGPX } from 'gpx-builder';
import { GpxFileAccess } from './types.ts';

export function mergeSimpleGPXs(parsers: (GpxParser | SimpleGPX)[]): SimpleGPX {
    const metadata = parsers[0].metadata;
    const waypoints = parsers.flatMap((p) => p.waypoints);
    const tracks = parsers.flatMap((p) => p.tracks);
    const routes = parsers.flatMap((p) => p.routes);

    return new SimpleGPX(metadata, waypoints, tracks, routes);
}

export class SimpleGPX extends GpxParser implements GpxFileAccess {
    metadata: MetaData;
    waypoints: Waypoint[];
    tracks: Track[];
    routes: Route[];
    start: Date = new Date();
    end: Date = new Date();

    public static fromString(raw: string) {
        const parser = new GpxParser();
        parser.parse(raw);
        const { metadata, waypoints, tracks, routes } = parser;
        return new SimpleGPX(metadata, waypoints, tracks, routes);
    }

    public duplicate() {
        return SimpleGPX.fromString(this.toString());
    }

    public constructor(metadata: MetaData, waypoints: Waypoint[], tracks: Track[], routes: Route[]) {
        super();
        this.metadata = metadata;
        this.waypoints = waypoints;
        this.tracks = tracks;
        this.routes = routes;

        const times = <number[]>[];
        [...routes, ...tracks].forEach((thing) => {
            times.push(
                ...thing.points.map((_point) => {
                    return new Date(_point.time).getTime();
                })
            );
        });
        if (waypoints.length) {
            times.push(
                ...waypoints.map((wp) => {
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
        // immediately propagate to all the time points
        [...this.routes, ...this.tracks].forEach((thing) => {
            thing.points.forEach((_point) => {
                _point.time = date.addSeconds(_point.time, interval);
            });
        });
        if (this.waypoints.length) {
            this.waypoints.forEach((wp) => {
                wp.time = date.addSeconds(wp.time, interval);
            });
        }
    }

    public appendBreak(interval: number) {
        // find the iterable with the last (in time) point
        let found: boolean = false;
        let points: Point[] = [];
        for (let thing of [...this.routes, ...this.tracks]) {
            points = thing.points;
            for (let _point of thing.points) {
                if (_point.time >= this.end) {
                    found = true;
                    break;
                }
            }
            if (found) {
                break;
            }
        }
        if (!found) {
            points = this.waypoints;
        }
        // duplicate the last point, but later
        let last_point = points[points.length - 1];
        points.push({
            lat: last_point.lat,
            lon: last_point.lon,
            ele: last_point.ele,
            time: date.addSeconds(new Date(last_point.time), interval),
        });
        this.end = date.addSeconds(this.end, interval);
    }

    public shiftToArrivalTime(arrival: string) {
        this.shift(date.subtract(this.end, new Date(arrival)).toSeconds());
    }

    public shiftToDepartureTime(departure: string) {
        this.shift(date.subtract(this.start, new Date(departure)).toSeconds());
    }

    public toString() {
        // this is an expensive operation
        // TODO sort the stuff or check if it's sorted anyway
        const builder = new BaseBuilder();
        const m = this.metadata;
        builder.setMetadata(
            new gpxBuilder.Metadata({
                name: m.name,
                desc: m.desc,
                time: m.time,
                link: toLink(m.link),
            })
        );
        if (this.routes.length) {
            builder.setRoutes(this.routes.map((_route) => route2route(_route)));
        }
        if (this.tracks.length) {
            builder.setTracks(this.tracks.map((_track) => track2track(_track)));
        }
        if (this.waypoints.length) {
            builder.setWayPoints(this.waypoints.map((_waypoint) => waypoint2waypoint(_waypoint)));
        }
        return buildGPX(builder.toObject());
    }

    getStart(): string {
        return this.start.toISOString();
    }
}

function toLink(link: string | Link | undefined): gpxBuilder.Link | undefined {
    if (link === undefined) {
        return undefined;
    }
    // @ts-ignore
    if (typeof link === 'string') {
        return new gpxBuilder.Link(link, {});
    } else if (!Object.keys(link).length) {
        return undefined;
    } else if (!('href' in link)) {
        return undefined;
    } else {
        return new gpxBuilder.Link(link.href, {
            text: link.text,
            type: link.type,
        });
    }
}

function point2point(_point: Point, timeshift: number = 0): gpxBuilder.Point {
    return new gpxBuilder.Point(_point.lat, _point.lon, {
        ele: _point.ele,
        time: date.addSeconds(new Date(_point.time), timeshift),
    });
}

function track2track(_track: Track, timeshift: number = 0): gpxBuilder.Track {
    // gpx-builder tracks can have segments, but gpx-parser ones do not
    return new gpxBuilder.Track(
        [new gpxBuilder.Segment(_track.points.map((_point) => point2point(_point, timeshift)))],
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

function route2route(_route: Route, timeshift: number = 0): gpxBuilder.Route {
    // you cannot get the properties of a type because at compile time or runtime it just might be a whole different fuck-up.
    // this is like an Exclude or Omit<T, K> but as an object rather than a type
    const { link, number, points, distance, elevation, slopes, ...without } = _route;

    return new gpxBuilder.Route({
        ...without,
        rtept: _route.points.map((_point) => point2point(_point, timeshift)),
        // @ts-ignore
        link: toLink(_track.link),
        number: Number(_route.number),
    });
}

function waypoint2waypoint(
    _waypoints: Waypoint,
    // @ts-ignore
    _timeshift: number = 0
): gpxBuilder.Point {
    return new gpxBuilder.Point(_waypoints.lat, _waypoints.lon, { ele: _waypoints.ele, name: _waypoints.name });
}