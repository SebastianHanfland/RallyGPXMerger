import * as gpxparser from 'gpxparser';
import * as gpxbuilder from 'gpx-builder/dist/builder/BaseBuilder/models';
import { default as GpxParser } from 'gpxparser';
import * as date from 'date-and-time';

export function findGPXStartEnd(gpx: GpxParser): { start: Date; end: Date } {
    const times = <number[]>[];
    [...gpx.routes, ...gpx.tracks].forEach((thing) => {
        times.push(
            ...thing.points.map((_point) => {
                return new Date(_point.time).getTime();
            })
        );
    });
    if (gpx.waypoints.length) {
        times.push(
            ...gpx.waypoints.map((wp) => {
                return new Date(wp.time).getTime();
            })
        );
    }
    return { start: new Date(Math.min(...times)), end: new Date(Math.max(...times)) };
}

export function timeShiftInSeconds(now: Date, later: Date): number {
    return date.subtract(now, later).toSeconds();
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
