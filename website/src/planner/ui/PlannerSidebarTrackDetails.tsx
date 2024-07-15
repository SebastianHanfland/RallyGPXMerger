import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails.tsx';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const { name } = track;
    return (
        <div className={'m-2'}>
            <h4>
                <span className={'mx-2'}>{name}</span>
                <TrackButtonsCell track={track} />
            </h4>
            <PlannerSidebarTrackFormDetails track={track} />

            <div style={{ width: '100%' }} className={'my-2'}>
                <h4>
                    <FormattedMessage id={'msg.segments'} />
                </h4>
                <TrackSegmentSelection track={track} />
            </div>
            <div></div>
        </div>
    );
};
