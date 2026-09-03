import { GeoLinkIcon } from '../../utils/icons/GeoLinkIcon.tsx';
import { StreetPathPoint } from '../logic/resolving/types.ts';
import { createStreetPathUrl } from '../../utils/streetPathUrl.ts';

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
