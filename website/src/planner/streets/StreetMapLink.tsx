import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { StreetPathPoint } from '../logic/resolving/types.ts';
import { createStreetPathUrl } from '../../utils/streetPathUrl.ts';

interface Props {
    path: StreetPathPoint[];
    streetName?: string;
}

export function StreetMapLink({ path, streetName }: Props) {
    const link = createStreetPathUrl(path, streetName);
    return (
        <a href={link} target={'_blank'} referrerPolicy={'no-referrer'} title={'Open street segment on map'}>
            <GeoLinkIcon />
        </a>
    );
}
