import { useSelector } from 'react-redux';
import { getDelaysOfTracksSelector } from '../../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';
import { getColor } from '../../../utils/colorUtil.ts';
import { ProgressBar } from 'react-bootstrap';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getParticipantsDelay } from '../../store/settings.reducer.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';

export const NodeOverviewContent = () => {
    const delaysOfTracks = useSelector(getDelaysOfTracksSelector);
    const tracks = useSelector(getTrackCompositions);
    const participantsDelay = useSelector(getParticipantsDelay);
    const branchNumbers = useSelector(getBranchNumbersSelector);
    const totalSize = branchNumbers[getBranchId(tracks.map(({ id }) => id))];

    return (
        <>
            {delaysOfTracks.map((trackDelay) => {
                const foundTrack = tracks.find((track) => track.id === trackDelay.trackId);
                return (
                    <div>
                        <div>{foundTrack?.name ?? ''}</div>
                        <div>
                            <ProgressBar
                                key={trackDelay.trackId}
                                className={'flex-fill mx-2'}
                                style={{ height: '30px' }}
                            >
                                {trackDelay.delays.map((delay) => (
                                    <ProgressBar
                                        striped={true}
                                        now={(delay.extraDelay / participantsDelay / totalSize) * 100}
                                        key={delay.segmentId}
                                        className={'bg-transparent text-dark'}
                                        label={delay.extraDelay / participantsDelay}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                                <ProgressBar
                                    now={((foundTrack?.peopleCount ?? 0) / totalSize) * 100}
                                    title={foundTrack?.name}
                                    label={foundTrack?.peopleCount}
                                    className={'text-light'}
                                    style={{ height: '30px', background: foundTrack ? getColor(foundTrack) : 'white' }}
                                    visuallyHidden
                                    key={0}
                                />
                            </ProgressBar>
                        </div>
                    </div>
                );
            })}
        </>
    );
    // {
    //     Object.entries(branchTracks).map(([segmentId, tracks]) => {
    //         return (
    //             <>
    //                 <div key={segmentId} className={'mt-5'}>
    //                     {tracks.map((track) => (
    //                         <span
    //                             key={track.id}
    //                             title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
    //                                 id: 'msg.trackPeople',
    //                             })}`}
    //                             style={{ backgroundColor: getColor(track), cursor: 'pointer' }}
    //                             className={'rounded-2 p-1'}
    //                         >
    //                             {track.name}
    //                         </span>
    //                     ))}
    //                     <span className={'mx-3'}>
    //                         <FormattedMessage
    //                             id={'msg.offsetByXs'}
    //                             values={{
    //                                 seconds: formatNumber(nodeSpecs.trackOffsets[segmentId] * participantsDelay, 0),
    //                             }}
    //                         />
    //                     </span>
    //                 </div>
    //                 <div
    //                     key={segmentId + '2'}
    //                     style={{ display: 'flex', justifyContent: 'row', alignItems: 'flex-end' }}
    //                 >
    //                     <ProgressBar key={segmentId} className={'flex-fill mx-2'} style={{ height: '30px' }}>
    //                         <ProgressBar
    //                             now={(nodeSpecs.trackOffsets[segmentId] / nodeSpecs.totalCount) * 100}
    //                             variant={'gray'}
    //                             className={'bg-transparent'}
    //                             style={{ height: '20px' }}
    //                             visuallyHidden
    //                             key={0}
    //                         />
    //                         {tracks.map((track) => (
    //                             <ProgressBar
    //                                 now={((track.peopleCount ?? 0) / nodeSpecs.totalCount) * 100}
    //                                 title={`${track.name}: ${track.peopleCount ?? 0} ${intl.formatMessage({
    //                                     id: 'msg.trackPeople',
    //                                 })}`}
    //                                 key={track.id}
    //                                 style={{ cursor: 'pointer', background: getColor(track) }}
    //                             />
    //                         ))}
    //                     </ProgressBar>
    //                     <div className={'mx-2'}>
    //                         <Form.Group>
    //                             <Form.Label>
    //                                 <FormattedMessage id={'msg.nodeOffset'} />
    //                             </Form.Label>
    //                             <Form.Control
    //                                 type="text"
    //                                 placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
    //                                 value={nodeSpecs.trackOffsets[segmentId]}
    //                             />
    //                         </Form.Group>
    //                     </div>
    //                 </div>
    //             </>
    //         );
    //     });
    // }
};
