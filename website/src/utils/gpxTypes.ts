export type Metadata = {
    name: string;
    desc: string;
    link: Link;
    author: Author;
    time: Date;
};

export type Waypoint = {
    name: string;
    cmt: string;
    desc: string;
    lat: number;
    lon: number;
    ele: number;
    time: string;
    sym: string;
};

export type Track = {
    name: string;
    number?: string;
    points: Point[];
    // cmt: string;
    // desc: string;
    // src: string;
    // link: Link;
    // type: string;
    // distance: Distance;
    // elevation: Elevation;
    // slopes: number[];
};

export type Route = {
    name: string;
    cmt: string;
    desc: string;
    src: string;
    number: string;
    link: Link;
    type: string;
    points: Point[];
    distance: Distance;
    elevation: Elevation;
    slopes: number[];
};

export type Point = {
    lat: number;
    lon: number;
    ele: number;
    time: string;
    extensions?: {};
};

export type Distance = {
    total: number;
    cumul: number[];
};

export type Elevation = {
    max: number;
    min: number;
    pos: number;
    neg: number;
    avg: number;
};

export type Author = {
    name: string;
    email: Email;
    link: Link;
};

export type Email = {
    id: string;
    domain: string;
};

export type Link = {
    href: string;
    text: string;
    type: string;
};

export type GpxJson = {
    metadata: Metadata;
    wpt?: Waypoint[];
    tracks: Track[];
    routes?: Route[];
};
