import { getLink } from '../download/trackPdfContentCreator.ts';

interface Props {
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    streetName: string;
}

export function StreetMapLink({ pointFrom, pointTo }: Props) {
    const link = getLink({ pointFrom, pointTo });
    return (
        <a href={link} target={'_blank'} referrerPolicy={'no-referrer'} title={'Open street segment on map'}>
            <img src={'geo-alt-blue.svg'} className="m-1" alt="open on map" color={'blue'} style={{ color: 'blue' }} />
        </a>
    );
}
