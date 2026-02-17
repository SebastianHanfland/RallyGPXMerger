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
import { AppDispatch } from '../store/planningStore.ts';
import flip from '../../assets/flip.svg';
import { DraggableIcon } from './DraggableIcon.tsx';
import { getParsedGpxSegments, segmentDataActions } from '../store/segmentData.redux.ts';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';

interface Props {
    trackId: string;
    segmentId: string;
    segmentName: string;
    fullGpxDelete: boolean;
}

export function TrackSelectionSegmentOption({ segmentId, segmentName, trackId, fullGpxDelete }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const nodes = useSelector(getNodePositions);
    const isNode = nodes.find((node) => node.segmentIdAfter === segmentId);

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
                <DraggableIcon />
                <div className={'m-2'} title={segmentName}>
                    {segmentName}
                </div>
                <div>
                    {isNode && (
                        <span
                            title={isNode.tracks.join('\n')}
                            style={{ backgroundColor: 'white', padding: '5px' }}
                            className={'rounded-2'}
                        >
                            {isNode.tracks.length} Node
                        </span>
                    )}
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
