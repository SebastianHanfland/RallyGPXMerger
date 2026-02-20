import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';
import { BlockTextDescription } from '../../utils/layout/BlockTextDescription.tsx';

export function SimpleGpxSegments() {
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);

    if (trackCompositions.length === 0) {
        dispatch(trackMergeActions.addTrackComposition());
        return null;
    }

    return (
        <div>
            <h5>
                <FormattedMessage id={'msg.segments'} />
            </h5>
            <BlockTextDescription messageId={'msg.description.simpleSegments'} />
            <div className={'m-3'}>
                <GpxCreationHint />
                <TrackSegmentSelection track={trackCompositions[0]} hideSelect={true} fullGpxDelete={true} />
            </div>
        </div>
    );
}
