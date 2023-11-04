import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { storage } from '../../store/storage.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { toKey } from '../../reverseGeoCoding/initializeResolvedPositions.ts';

export function ProofOfConcept() {
    const gpxSegments = useSelector(getGpxSegments);

    const resolvedPositions = storage.getResolvedPositions();
    console.log(resolvedPositions);
    return (
        <div>
            POC
            <div>
                {gpxSegments.map((segment) => {
                    const gpx = SimpleGPX.fromString(segment.content);
                    return (
                        <div>
                            {'Something here' + segment.filename}
                            {gpx.tracks[0].points.map((point) => {
                                const positionKey = toKey(point);
                                const street = resolvedPositions[positionKey];
                                return <div>{`${street}`}</div>;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
