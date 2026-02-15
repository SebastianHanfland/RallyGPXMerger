import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSegmentIdClipboard, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import trash from '../../assets/trashB.svg';
import copyToClipboard from '../../assets/copy-to-clipboard.svg';
import inputFromClipboard from '../../assets/input-from-clipboard.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';

interface Props {
    track: TrackComposition;
}

export function TrackButtonsCell({ track }: Props) {
    const intl = useIntl();
    const { id } = track;
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const calculatedTrack = useSelector(getCalculatedTracks).find((track) => track.id === id);
    console.log('Track Button Cell');

    const segmentIdClipboard = useSelector(getSegmentIdClipboard);

    const content = getGpxContentFromTimedPoints(calculatedTrack?.points ?? [], calculatedTrack?.filename ?? 'Track');

    return (
        <DropdownButton
            as={ButtonGroup}
            key={'primary'}
            id={`dropdown-variants-${'primary'}`}
            variant={'primary'.toLowerCase()}
            title={''}
        >
            <Dropdown.Item
                onClick={() => setShowModal(true)}
                title={intl.formatMessage({ id: 'msg.removeTrack.hint' }, { name: track.name ?? '' })}
            >
                <img src={trash} className="m-1" alt="trash" />
                <span>
                    <FormattedMessage id={'msg.removeTrack'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(trackMergeActions.setSegmentIdClipboard(track.segmentIds))}>
                <img src={copyToClipboard} alt="copy to clipboard" color={'#ffffff'} className="m-1" />
                <span>
                    <FormattedMessage id={'msg.copySegments'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    dispatch(trackMergeActions.setSegments({ id: track.id, segments: segmentIdClipboard! }));
                }}
                disabled={!segmentIdClipboard}
            >
                <img src={inputFromClipboard} alt="input from clipboard" color={'#ffffff'} className={'m-1'} />
                <span>
                    <FormattedMessage id={'msg.pasteSegments'} />
                </span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeTrackComposition(id));
                    }}
                    closeModal={() => setShowModal(false)}
                    title={`Removing track ${track.name ?? ''}`}
                    body={`Do you really want to remove the track ${track.name ?? ''}?`}
                />
            )}
            {calculatedTrack && (
                <FileDownloaderDropdownItem content={content} name={calculatedTrack.filename + '.gpx'} />
            )}
        </DropdownButton>
    );
}
