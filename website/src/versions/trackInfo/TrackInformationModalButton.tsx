import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch } from 'react-redux';
import { mapActions } from '../store/map.reducer.ts';

export function TrackInformationModalButton() {
    const dispatch = useDispatch();

    const setShowModal = (value: boolean) => dispatch(mapActions.setShowTrackInfo(value));

    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                <FormattedMessage id={'msg.trackInfoShort'} />
            </Button>
        </>
    );
}
