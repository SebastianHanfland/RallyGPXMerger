import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSegmentIdClipboard, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { calculatedTracksActions, getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import trash from '../../assets/trashB.svg';
import copyToClipboard from '../../assets/copy-to-clipboard.svg';
import inputFromClipboard from '../../assets/input-from-clipboard.svg';

interface Props {
    track: TrackComposition;
}

export function TrackButtonsCell({ track }: Props) {
    const { id } = track;
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const calculatedTrack = useSelector(getCalculatedTracks).find((track) => track.id === id);
    const segmentIdClipboard = useSelector(getSegmentIdClipboard);

    return (
        <td>
            <DropdownButton
                as={ButtonGroup}
                key={'primary'}
                id={`dropdown-variants-${'primary'}`}
                variant={'primary'.toLowerCase()}
                title={''}
            >
                <Dropdown.Item onClick={() => setShowModal(true)} title={`Remove track ${track.name ?? ''}`}>
                    <img src={trash} className="m-1" alt="trash" />
                    <span>Remove track</span>
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => dispatch(trackMergeActions.setSegmentIdClipboard(track.segmentIds))}
                    title={'Copy segmentIds to clipboard'}
                >
                    <img src={copyToClipboard} alt="copy to clipboard" color={'#ffffff'} className="m-1" />
                    <span>Copy segmentIds to clipboard</span>
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => {
                        dispatch(trackMergeActions.setSegments({ id: track.id, segments: segmentIdClipboard! }));
                        dispatch(trackMergeActions.setSegmentIdClipboard(undefined));
                    }}
                    title={'Paste segmentIds to clipboard'}
                    disabled={!segmentIdClipboard}
                >
                    <img src={inputFromClipboard} alt="input from clipboard" color={'#ffffff'} className={'m-1'} />
                    <span>Paste segmentIds to clipboard</span>
                </Dropdown.Item>
                {showModal && (
                    <ConfirmationModal
                        onConfirm={() => {
                            dispatch(calculatedTracksActions.removeSingleCalculatedTrack(id));
                            dispatch(trackMergeActions.removeTrackComposition(id));
                        }}
                        closeModal={() => setShowModal(false)}
                        title={`Removing track ${track.name ?? ''}`}
                        body={`Do you really want to remove the track ${track.name ?? ''}?`}
                    />
                )}
                {calculatedTrack && (
                    <FileDownloaderDropdownItem
                        content={calculatedTrack.content}
                        name={calculatedTrack.filename + '.gpx'}
                    />
                )}
            </DropdownButton>
        </td>
    );
}
