import { useDispatch, useSelector } from 'react-redux';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Button, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { FileChangeButton } from '../segments/FileChangeButton.tsx';
import { RemoveFileButton } from '../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../segments/ResetResolvedStreetsButton.tsx';
import { AppDispatch } from '../store/planningStore.ts';
import flip from '../../assets/flip.svg';
import { DraggableIcon } from './DraggableIcon.tsx';
import { getParsedGpxSegments, segmentDataActions } from '../store/segmentData.redux.ts';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { TrackSelectionNodeButton } from './TrackSelectionNodeButton.tsx';
import { getUsagesOfSegment } from '../segments/segmentUsageCounter.ts';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionSegmentOption({ segmentId, segmentName, trackId, fullGpxDelete }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const trackCompositions = useSelector(getTrackCompositions);
    const { tooltip } = getUsagesOfSegment(trackCompositions, segmentId, intl);

    const gpxSegment = useSelector(getParsedGpxSegments).find((segment) => segment.id === segmentId);
    if (!gpxSegment) {
        return null;
    }
    const { id, filename, flipped } = gpxSegment;
    const content = useOnTheFlyCreatedGpx(gpxSegment);

    return (
        <div
            onMouseEnter={() => dispatch(mapActions.setHighlightedSegmentId(segmentId))}
            onMouseLeave={() => dispatch(mapActions.setHighlightedSegmentId(undefined))}
        >
            <div
                className={'rounded-2 d-flex justify-content-between'}
                style={{
                    border: '1px solid transparent',
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '1px',
                    backgroundColor: getColorFromUuid(segmentId),
                }}
                key={segmentId}
            >
                <div className={'m-2'} title={segmentName + '\n' + tooltip}>
                    <DraggableIcon />
                    {segmentName}
                </div>
                <div>
                    <TrackSelectionNodeButton segmentId={segmentId} />
                    {flipped && <img src={flip} className="m-1" alt="flip" />}
                    <Button
                        variant="danger"
                        size={'sm'}
                        className={'m-1'}
                        onClick={() => {
                            dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }));
                            if (fullGpxDelete) {
                                dispatch(segmentDataActions.removeGpxSegment(segmentId));
                            }
                        }}
                        title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
                    >
                        X
                    </Button>
                    <DropdownButton
                        as={ButtonGroup}
                        key={'primary'}
                        id={`dropdown-variants-${'primary'}`}
                        variant={'primary'}
                        title={''}
                    >
                        <FileDownloaderDropdownItem content={content} name={`${filename}.gpx`} />

                        <FileChangeButton id={id} name={filename} />
                        <RemoveFileButton id={id} name={filename} />
                        <FlipGpxButton id={id} name={filename} flipped={flipped} />
                        <ResetResolvedStreetsButton id={id} name={filename} />
                    </DropdownButton>
                </div>
            </div>
        </div>
    );
}
