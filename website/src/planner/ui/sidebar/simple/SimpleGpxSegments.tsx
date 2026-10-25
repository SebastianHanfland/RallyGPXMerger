import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AppDispatch } from '../../../store/planningStore.ts';
import { TrackSegmentSelection } from '../../../tracks/segment-selection/TrackSegmentSelection.tsx';
import { getTrackCompositions, trackMergeActions } from '../../../store/trackMerge.reducer.ts';
import { GpxCreationHint } from '../../../segments/GpxCreationHint.tsx';
import { DescriptionInfoButton } from '../DescriptionInfoButton.tsx';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';

export function SimpleGpxSegments() {
    const dispatch: AppDispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const gpxSegments = useSelector(getParsedGpxSegments);

    if (trackCompositions.length === 0) {
        dispatch(trackMergeActions.addTrackComposition());
        return null;
    }

    return (
        <div>
            <div className={'d-flex justify-content-between'}>
                <div />
                <h5>
                    <FormattedMessage id={'msg.segments'} />
                </h5>
                <DescriptionInfoButton
                    titleMessageId={'msg.segments'}
                    descriptionMessageId={'msg.description.simpleSegments'}
                >
                    <GpxCreationHint />
                </DescriptionInfoButton>
            </div>
            {gpxSegments.length === 0 && <GpxCreationHint />}
            <div className={'m-3'}>
                <TrackSegmentSelection track={trackCompositions[0]} hideSelect={true} fullGpxDelete={true} />
            </div>
        </div>
    );
}
