import { Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { getSegmentIdClipboard, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackComposition } from '../store/types.ts';
import copyToClipboard from '../../assets/copy-to-clipboard.svg';
import inputFromClipboard from '../../assets/input-from-clipboard.svg';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';
import { TrashIcon } from '../../utils/icons/TrashIcon.tsx';
import { TrackColorActionItem } from './TrackColorActionItem.tsx';

interface Props {
    track: TrackComposition;
    onAction?: () => void;
}

export function TrackActionItems({ track, onAction }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { id } = track;
    const [showModal, setShowModal] = useState(false);
    const calculatedTrack = useSelector(getCalculateTracks).find((candidate) => candidate.id === id);
    const segmentIdClipboard = useSelector(getSegmentIdClipboard);

    const closeMenu = () => onAction?.();

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    setShowModal(true);
                }}
                title={intl.formatMessage({ id: 'msg.removeTrack.hint' }, { name: track.name ?? '' })}
            >
                <TrashIcon />
                <span>
                    <FormattedMessage id={'msg.removeTrack'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    dispatch(trackMergeActions.setSegmentIdClipboard(track.segments));
                    closeMenu();
                }}
            >
                <img src={copyToClipboard} alt="copy to clipboard" color={'#ffffff'} className="m-1" />
                <span>
                    <FormattedMessage id={'msg.copySegments'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item
                onClick={() => {
                    dispatch(trackMergeActions.setSegments({ id: track.id, segments: segmentIdClipboard! }));
                    closeMenu();
                }}
                disabled={!segmentIdClipboard}
            >
                <img src={inputFromClipboard} alt="input from clipboard" color={'#ffffff'} className={'m-1'} />
                <span>
                    <FormattedMessage id={'msg.pasteSegments'} />
                </span>
            </Dropdown.Item>
            <TrackColorActionItem track={track} onAction={onAction} />
            {showModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.removeTrackComposition(id));
                        setShowModal(false);
                        closeMenu();
                    }}
                    closeModal={() => {
                        setShowModal(false);
                        closeMenu();
                    }}
                    title={`Removing track ${track.name ?? ''}`}
                    body={`Do you really want to remove the track ${track.name ?? ''}?`}
                />
            )}
            {calculatedTrack && (
                <FileDownloaderDropdownItem
                    content={() =>
                        getGpxContentFromTimedPoints(calculatedTrack.points, calculatedTrack.filename ?? 'Track')
                    }
                    name={calculatedTrack.filename + '.gpx'}
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
