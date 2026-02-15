import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';
import { PlannerSidebarTrackFormDetails } from './PlannerSidebarTrackFormDetails.tsx';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { TrackDocuments } from './TrackDocuments.tsx';
import { getTrackStreetInfos } from '../logic/resolving/aggregate/calculateTrackStreetInfosNew.ts';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const { name } = track;
    const trackInfos = useSelector(getTrackStreetInfos);
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
    return (
        <div className={'m-2'}>
            <div className={'m-3'}>
                <h4 className={'d-flex justify-content-around'}>
                    <div>
                        <span className={'mx-2'}>{`${name}${distanceInfo}`}</span>
                        <TrackButtonsCell track={track} />
                    </div>
                    <TrackDocuments matchedTrackInfo={matchedTrackInfo} />
                </h4>
                <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
                <PlannerSidebarTrackFormDetails track={track} />
            </div>

            <div style={{ width: '100%' }} className={'my-2'}>
                <h4>
                    <FormattedMessage id={'msg.segments'} />
                </h4>
                <div className={'m-3'}>
                    <TrackSegmentSelection track={track} />
                </div>
            </div>
            <div></div>
        </div>
    );
};
