import { setReadableTracks } from '../../logic/MergeCalculation.ts';
import { useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { useEffect } from 'react';

export const parseCalculatedTracksHook = () => {
    const calculatedTracks = useSelector(getCalculatedTracks);

    useEffect(() => {
        if (calculatedTracks.length > 0) {
            setReadableTracks(
                calculatedTracks.map((track) => ({ id: track.id, gpx: SimpleGPX.fromString(track.content) }))
            );
        }
    }, [calculatedTracks.length]);
};
