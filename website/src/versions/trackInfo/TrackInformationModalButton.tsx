import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getIsLive, mapActions } from '../store/map.reducer.ts';
import { setStartAndEndTime } from '../data/loadFilesHook.ts';

export function TrackInformationModalButton() {
    const dispatch = useDispatch();
    const isLive = useSelector(getIsLive);

    const setShowModal = (value: boolean) => dispatch(mapActions.setShowTrackInfo(value));

    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                <FormattedMessage id={'msg.trackInfoShort'} />
            </Button>
            <Button
                onClick={() => {
                    if (isLive) {
                        setStartAndEndTime(dispatch);
                    }
                    dispatch(mapActions.setIsLive(!isLive));
                }}
                variant={'info'}
                style={{ marginLeft: '10px' }}
            >
                <FormattedMessage id={isLive ? 'msg.showPlan' : 'msg.showLive'} />
            </Button>
        </>
    );
}
