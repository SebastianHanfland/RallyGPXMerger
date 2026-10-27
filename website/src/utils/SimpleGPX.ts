import * as gpxBuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import { addSeconds } from 'date-and-time';
import { BaseBuilder, buildGPX } from 'gpx-builder';
import { GpxFileAccess } from '../common/calculation/types';
import { Link, Metadata, Point, Route, Track, Waypoint } from './gpxTypes';
import { GpxParser } from './GpxParser';

export function mergeSimpleGPXs(parsers: SimpleGPX[]): SimpleGPX {
    const metadata = parsers[0].metadata;
    const waypoints = parsers.flatMap((p) => p.waypoints);
    const tracks = parsers.flatMap((p) => p.tracks);
    const routes = parsers.flatMap((p) => p.routes);

    return new SimpleGPX(metadata, waypoints, tracks, routes);
}

function getPointsFromTracksAndRoutes(routes: Route[], tracks: Track[]) {
    return [...routes.map((route) => route.points), ...(tracks ?? []).map((track) => track.points)];
}

export class SimpleGPX extends GpxParser implements GpxFileAccess {
    metadata: Metadata;
    waypoints: Waypoint[];
    tracks: Track[];
    routes: Route[];
    start: Date;
    mergeTracks: Boolean;

    public static fromString(raw: string) {
        const parser = new GpxParser();
        const gpxJson = parser.parse(raw);
        const { metadata, wpt, tracks, routes } = gpxJson;
        return new SimpleGPX(metadata, wpt ?? [], tracks, routes ?? []);
    }

    public constructor(
        metadata: Metadata,
        waypoints: Waypoint[],
        tracks: Track[],
        routes: Route[],
        mergeTracks: Boolean = true
    ) {
        super();
        this.metadata = metadata;
        this.waypoints = waypoints;
        this.tracks = (tracks ?? []).map((track) => ({
            ...track,
            points: track.points.map((point) => ({
                ...point,
                lat: typeof point.lat === 'string' ? Number(point.lat) : point.lat,
                lon: typeof point.lon === 'string' ? Number(point.lon) : point.lon,
                ele: typeof point.ele === 'string' ? Number(point.ele) : point.ele,
            })),
        }));
        this.routes = routes;
        this.mergeTracks = mergeTracks;

        const times = <number[]>[];
        getPointsFromTracksAndRoutes(routes, tracks).forEach((points) => {
            times.push(
                ...points.map((_point: Point) => {
                    return new Date(_point.time).getTime();
                })
            );
        });
        this.start = new Date(Math.min(...times));
    }

    public getPoints() {
        return this.tracks.flatMap((track) => track.points).map((point) => ({ ...point }));
    }

    public toString() {
        // this is an expensive operation
        const builder = new BaseBuilder();
        const m = this.metadata;
        builder.setMetadata(
            new gpxBuilder.Metadata({
                name: m?.name,
                desc: m?.desc,
                time: m?.time,
                link: toLink(m?.link),
            })
        );
        if (this.routes.length) {
            builder.setRoutes(this.routes.map((_route) => route2route(_route)));
        }
        if (this.tracks.length) {
            if (this.mergeTracks) {
                // ensure the output file contains only a single track
                const first = this.tracks[0];
                builder.setTracks([
                    new gpxBuilder.Track([tracks2seg(this.tracks)], {
                        name: first?.name,
                        number: Number(first?.number),
                    }),
                ]);
            } else {
                builder.setTracks(this.tracks.map((_track) => track2track(_track)));
            }
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
    return new gpxBuilder.Point(
        typeof _point.lat === 'string' ? Number(_point.lat) : _point.lat,
        typeof _point.lon === 'string' ? Number(_point.lon) : _point.lon,
        {
            ele: typeof _point.ele === 'string' ? Number(_point.ele) : _point.ele,
            ...(_point.time ? { time: addSeconds(new Date(_point.time), timeshift) } : {}),
        }
    );
}

function track2track(_track: Track, timeshift: number = 0): gpxBuilder.Track {
    return new gpxBuilder.Track([track2seg(_track, timeshift)], {
        name: _track.name,
        number: Number(_track.number),
    });
}

function track2seg(_track: Track, timeshift: number = 0): gpxBuilder.Segment {
    // gpx-builder (i.e. output) tracks can have segments, but gpx-parser (i.e. input) ones do not
    return new gpxBuilder.Segment(_track.points.map((_point: Point) => point2point(_point, timeshift)));
}

function tracks2seg(_track: Track[], timeshift: number = 0): gpxBuilder.Segment {
    return new gpxBuilder.Segment(
        _track.flatMap((track) => track.points.map((_point: Point) => point2point(_point, timeshift)))
    );
}

function route2route(_route: Route, timeshift: number = 0): gpxBuilder.Route {
    // you cannot get the properties of a type because at compile time or runtime it just might be a whole different fuck-up.
    // this is like an Exclude or Omit<T, K> but as an object rather than a type
    const { link, number, points, distance, elevation, slopes, ...without } = _route;

    return new gpxBuilder.Route({
        ...without,
        rtept: _route.points.map((_point: Point) => point2point(_point, timeshift)),
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
