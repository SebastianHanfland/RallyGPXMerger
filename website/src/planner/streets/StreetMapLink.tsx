import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon';
import { StreetPathPoint } from '../logic/resolving/types';
import { createStreetPathUrl } from '../../utils/streetPathUrl';

interface Props {
    path?: StreetPathPoint[];
    paths?: StreetPathPoint[][];
    streetName?: string;
}

export function StreetMapLink({ path, paths, streetName }: Props) {
    const streetPaths = paths ?? (path ? [path] : []);
    return (
        <>
            {streetPaths.map((streetPath, index) => {
                const link = createStreetPathUrl(streetPath, streetName);
                return (
                    <a
                        href={link}
                        target={'_blank'}
                        referrerPolicy={'no-referrer'}
                        title={'Open street segment on map'}
                        key={index}
                    >
                        <GeoLinkIcon />
                    </a>
                );
            })}
        </>
    );
}
