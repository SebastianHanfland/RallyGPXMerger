import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AppDispatch } from '../store/store.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';

export function SimpleGpxSegments() {
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const track = trackCompositions[0];

    if (!track) {
        dispatch(trackMergeActions.addTrackComposition());
        return null;
    }

    return (
        <div>
            <h5>
                <FormattedMessage id={'msg.segments'} />
            </h5>
            <div className={'m-3'}>
                <TrackSegmentSelection track={track} hideSelect={true} fullGpxDelete={true} />
                <GpxCreationHint />
            </div>
        </div>
    );
}
