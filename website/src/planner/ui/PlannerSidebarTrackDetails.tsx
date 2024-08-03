import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails.tsx';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { TrackDocuments } from './TrackDocuments.tsx';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const { name } = track;
    const trackInfos = useSelector(getEnrichedTrackStreetInfos);
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
    return (
        <div className={'m-2'}>
            <h4 className={'d-flex justify-content-around'}>
                <div>
                    <span className={'mx-2'}>{`${name}${distanceInfo}`}</span>
                    <TrackButtonsCell track={track} />
                </div>
                <TrackDocuments matchedTrackInfo={matchedTrackInfo} />
            </h4>
            <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
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
