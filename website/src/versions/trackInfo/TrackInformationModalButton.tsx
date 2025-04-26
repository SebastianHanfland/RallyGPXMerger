import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getEndDisplayMapTime, getIsLive, getStartDisplayMapTime, mapActions } from '../store/map.reducer.ts';
import { setStartAndEndTime } from '../data/loadFilesHook.ts';
import { DisplayDispatch } from '../store/store.ts';

export function TrackInformationModalButton() {
    const dispatch: DisplayDispatch = useDispatch();
    const isLive = useSelector(getIsLive);
    const startTime = useSelector(getStartDisplayMapTime);
    const endTime = useSelector(getEndDisplayMapTime);
    const rallyIsToday =
        startTime?.startsWith(new Date().toISOString().substring(0, 10)) ||
        endTime?.startsWith(new Date().toISOString().substring(0, 10));

    const setShowModal = (value: boolean) => dispatch(mapActions.setShowTrackInfo(value));

    return (
        <>
            <Button onClick={() => setShowModal(true)}>
                <FormattedMessage id={'msg.trackInfoShort'} />
            </Button>
            {rallyIsToday && (
                <Button
                    onClick={() => {
                        if (isLive) {
                            dispatch(setStartAndEndTime);
                        }
                        dispatch(mapActions.setIsLive(!isLive));
                    }}
                    variant={'info'}
                    style={{ marginLeft: '10px' }}
                >
                    <FormattedMessage id={isLive ? 'msg.showPlan' : 'msg.showLive'} />
                </Button>
            )}
        </>
    );
}
