import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getEndMapTime, getIsLive, getStartMapTime, mapActions } from '../store/map.reducer.ts';
import { setStartAndEndTime } from '../data/loadFilesHook.ts';

export function TrackInformationModalButton() {
    const dispatch = useDispatch();
    const isLive = useSelector(getIsLive);
    const startTime = useSelector(getStartMapTime);
    const endTime = useSelector(getEndMapTime);
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
                            setStartAndEndTime(dispatch);
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
