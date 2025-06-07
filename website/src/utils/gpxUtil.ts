import { useEffect, useState } from 'react';
import { getGpxContentStringFromParsedSegment } from './SimpleGPXFromPoints.ts';
import { ParsedGpxSegment } from '../planner/new-store/types.ts';

export function useOnTheFlyCreatedGpx(clickedSegment: ParsedGpxSegment | undefined) {
    const [gpxContent, setGpxContent] = useState('');

    useEffect(() => {
        if (clickedSegment) {
            setGpxContent(getGpxContentStringFromParsedSegment(clickedSegment));
        }
    }, []);
    return gpxContent;
}
