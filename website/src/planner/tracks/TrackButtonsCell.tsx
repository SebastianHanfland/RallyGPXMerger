import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSegmentIdClipboard, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import copyToClipboard from '../../assets/copy-to-clipboard.svg';
import inputFromClipboard from '../../assets/input-from-clipboard.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { getGpxContentFromTimedPoints } from '../../utils/SimpleGPXFromPoints.ts';
import { getColor } from '../../utils/colorUtil.ts';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';
import { TrashIcon } from '../../utils/icons/TrashIcon.tsx';
import { ColorPicker } from '../../utils/ColorPicker.tsx';

interface Props {
    track: TrackComposition;
}

export function TrackButtonsCell({ track }: Props) {
    const intl = useIntl();
    const { id } = track;
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState(getColor(track));
    const calculatedTrack = useSelector(getCalculateTracks).find((track) => track.id === id);

    const segmentIdClipboard = useSelector(getSegmentIdClipboard);

    const content = getGpxContentFromTimedPoints(calculatedTrack?.points ?? [], calculatedTrack?.filename ?? 'Track');

    useEffect(() => {
        setColor(getColor(track));
    }, [track.id]);

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
                <TrashIcon />
                <span>
                    <FormattedMessage id={'msg.removeTrack'} />
                </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(trackMergeActions.setSegmentIdClipboard(track.segments))}>
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
            <Dropdown.Item onClick={() => setShowColorModal(true)}>
                <ColorBlob color={getColor(track)} />
                <span>
                    <FormattedMessage id={'msg.setColor'} />
                </span>
            </Dropdown.Item>
            {showColorModal && (
                <ConfirmationModal
                    onConfirm={() => {
                        dispatch(trackMergeActions.setTrackColor({ id, color }));
                        setShowColorModal(false);
                    }}
                    closeModal={() => setShowColorModal(false)}
                    title={`${intl.formatMessage({ id: 'msg.setColor' })} ${track.name ?? ''}`}
                    body={<ColorPicker color={color} setColor={setColor} />}
                />
            )}

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
