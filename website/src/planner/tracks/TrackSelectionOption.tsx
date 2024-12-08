import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Button, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { getColorFromUuid } from '../../utils/colorUtil.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { FileChangeButton } from '../segments/FileChangeButton.tsx';
import { RemoveFileButton } from '../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../segments/ResetResolvedStreetsButton.tsx';
import { getGpxSegments, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { BREAK_IDENTIFIER } from '../logic/merge/types.ts';
import flip from '../../assets/flip.svg';
import { DraggableIcon } from './DraggableIcon.tsx';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
}

function isABreak(segmentId: string) {
    return segmentId.includes(BREAK_IDENTIFIER);
}

function getPauseLabel(segmentId: string) {
    const minutesBreak = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
    return `${minutesBreak > 0 ? '+' : '-'} ${minutesBreak > 0 ? minutesBreak : -1 * minutesBreak} min`;
}

export function TrackSelectionOption({ segmentId, segmentName, trackId, fullGpxDelete }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    if (isABreak(segmentId)) {
        return (
            <div
                className={' rounded-2 d-flex justify-content-between'}
                style={{
                    border: '1px solid transparent',
                    borderColor: 'black',
                    cursor: 'pointer',
                    margin: '1px',
                    backgroundColor: getColorFromUuid(segmentId),
                }}
                key={segmentId}
            >
                <DraggableIcon />
                <div className={'m-2'} title={segmentName}>
                    {getPauseLabel(segmentId)}
                </div>
                <div>
                    <Button
                        variant="danger"
                        size={'sm'}
                        className={'m-1'}
                        onClick={() => {
                            dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }));
                            dispatch(triggerAutomaticCalculation);
                        }}
                        title={intl.formatMessage({ id: 'msg.removeTrackSegment' }, { segmentName })}
                    >
                        X
                    </Button>
                </div>
            </div>
        );
    }

    const gpxSegment = useSelector(getGpxSegments).find((segment) => segment.id === segmentId);
    if (!gpxSegment) {
        return null;
    }
    const { id, filename, content, flipped, streetsResolved } = gpxSegment;

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
                <DraggableIcon />
                <div className={'m-2'} title={segmentName}>
                    {segmentName}
                </div>
                <div>
                    {flipped && <img src={flip} className="m-1" alt="flip" />}
                    <Button
                        variant="danger"
                        size={'sm'}
                        className={'m-1'}
                        onClick={() => {
                            dispatch(trackMergeActions.removeSegmentFromTrack({ id: trackId, segmentId }));
                            if (fullGpxDelete) {
                                dispatch(gpxSegmentsActions.removeGpxSegment(segmentId));
                            }
                            dispatch(triggerAutomaticCalculation);
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
                        <ResetResolvedStreetsButton id={id} name={filename} streetsResolved={streetsResolved} />
                    </DropdownButton>
                </div>
            </div>
        </div>
    );
}
