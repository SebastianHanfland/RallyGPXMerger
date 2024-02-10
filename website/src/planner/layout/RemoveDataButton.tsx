import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { useState } from 'react';
import trash from '../../assets/trash.svg';
import { mapActions } from '../store/map.reducer.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { clearReadableTracks } from '../cache/readableTracks.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';

export function RemoveDataButton() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const intl = useIntl();

    const removeAllData = () => {
        clearReadableTracks();
        dispatch(gpxSegmentsActions.clearGpxSegments());
        dispatch(trackMergeActions.clear());
        dispatch(calculatedTracksActions.removeCalculatedTracks());
        dispatch(mapActions.setShowGpxSegments(true));
        dispatch(mapActions.setShowBlockStreets(false));
        dispatch(mapActions.setShowCalculatedTracks(false));
        dispatch(geoCodingActions.clear());
        dispatch(layoutActions.selectSection('start'));
        localStorage.clear();
        setShowModal(false);
    };
    return (
        <>
            <Button
                variant="danger"
                title="Delete all GPX segments, track compositions and tracks"
                onClick={() => setShowModal(true)}
            >
                <img src={trash} className="m-1" alt="trash" />
                <FormattedMessage id={'msg.removeAllData'} />
            </Button>
            {showModal && (
                <ConfirmationModal
                    onConfirm={removeAllData}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.removeAllData.modalTitle' })}
                    body={intl.formatMessage({ id: 'msg.removeAllData.modalBody' })}
                />
            )}
        </>
    );
}
