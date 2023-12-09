import { Button, Form } from 'react-bootstrap';
import { TrackComposition } from '../../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { useState } from 'react';
import { ConfirmationModal } from '../ConfirmationModal.tsx';
import { FileDownloader } from '../segments/FileDownloader.tsx';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { TrackSelectionCell } from './TrackSelectionCell.tsx';

interface Props {
    track: TrackComposition;
}

export function MergeTableTrack({ track }: Props) {
    const { name, id } = track;
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const calculatedTrack = useSelector(getCalculatedTracks).find((track) => track.id === id);

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder="Track name"
                    value={name}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }))
                    }
                />
            </td>
            <TrackSelectionCell track={track} />
            <td>
                <>
                    <Button
                        variant="danger"
                        onClick={() => setShowModal(true)}
                        title={`Remove track ${track.name ?? ''}`}
                    >
                        x
                    </Button>
                    {showModal && (
                        <ConfirmationModal
                            onConfirm={() => dispatch(trackMergeActions.removeTrackComposition(id))}
                            closeModal={() => setShowModal(false)}
                            title={`Removing track ${track.name ?? ''}`}
                            body={`Do you really want to remove the track ${track.name ?? ''}?`}
                        />
                    )}
                    {calculatedTrack && (
                        <FileDownloader
                            id={calculatedTrack.id}
                            content={calculatedTrack.content}
                            name={calculatedTrack.filename + '.gpx'}
                            onlyIcon={true}
                        />
                    )}
                </>
            </td>
        </tr>
    );
}
