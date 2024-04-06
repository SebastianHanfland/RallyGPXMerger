export interface GeoApifyLegStep {
    osm_way_id: number;
    speed: number;
    speed_limit: number;
    surface: string;
    lane_count: number;
    road_class: string;
    from_index: number;
    to_index: number;
    name?: string;
    toll: boolean;
    tunnel: boolean;
    bridge: boolean;
    roundabout: boolean;
    traversability: string;
    time: number;
    distance: number;
    begin_bearing: number;
    end_bearing: number;
}

export interface GeoApifyWayPoint {
    original_index: number;
    location: [number, number];
    original_location: [number, number];
    match_type: 'matched' | 'unmatched' | 'interpolated';
    match_distance: number;
    leg_index: number;
    step_index: number;
}

export interface GeoApifyLeg {
    time: number;
    distance: number;
    steps: GeoApifyLegStep[];
}

export interface GeoApifyMapMatchingResult {
    type: string;
    features: {
        type: string;
        properties: {
            distance: number;
            time: number;
            legs: GeoApifyLeg[];
            mode: string;
            waypoints: GeoApifyWayPoint[];
        };
        geometry: { type: string; coordinates: [[number, number][]] };
    }[];
}

export enum TrackWayPointType {
    Track = 'TRACK',
    Break = 'BREAK',
    Node = 'NODE',
}

export interface TrackWayPoint {
    streetName: string | null;
    frontArrival: string;
    frontPassage: string;
    backArrival: string;
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    postCode?: number;
    district?: string;
    distanceInKm?: number;
    speed?: number;
    type?: TrackWayPointType;
    breakLength?: number;
    nodeTracks?: string[];
}

export interface TrackStreetInfo {
    id: string;
    name: string;
    startFront: string;
    arrivalBack: string;
    arrivalFront: string;
    distanceInKm: number;
    wayPoints: TrackWayPoint[];
    peopleCount?: number;
}

export interface BlockedStreetInfo {
    streetName: string | null;
    postCode?: number;
    district?: string;
    frontArrival: string;
    backPassage: string;
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    // Maybe also which tracks pass through here?
}
