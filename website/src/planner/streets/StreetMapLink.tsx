import { getLink } from '../../utils/linkUtil.ts';
import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';

interface Props {
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
}

export function StreetMapLink({ pointFrom, pointTo }: Props) {
    const link = getLink({ pointFrom, pointTo });
    return (
        <a href={link} target={'_blank'} referrerPolicy={'no-referrer'} title={'Open street segment on map'}>
            <GeoLinkIcon />
        </a>
    );
}
