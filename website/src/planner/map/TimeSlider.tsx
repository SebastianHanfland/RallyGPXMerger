import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from '../store/map.reducer.ts';
import { getCurrentTimeStamp } from './hooks/trackSimulationReader.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { CSSProperties, useEffect, useState } from 'react';
import play from '../../assets/play.svg';
import fast from '../../assets/fast.svg';
import stop from '../../assets/stop.svg';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { useIntl } from 'react-intl';

let interval: NodeJS.Timeout | undefined;

let timeMirror = 0;

const sliderStyle: CSSProperties = {
    position: 'fixed',
    width: '350px',
    height: '45px',
    borderRadius: '10px',
    left: 245,
    bottom: 50,
    zIndex: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
    cursor: 'pointer',
};

const buttonStyle: CSSProperties = {
    height: '24px',
    width: '24px',
    margin: 0,
    padding: 0,
};

export function TimeSlider() {
    const intl = useIntl();
    const mapTime = useSelector(getCurrenMapTime);
    const dateValue = useSelector(getCurrentTimeStamp);
    timeMirror = mapTime;
    const dispatch = useDispatch();

    const [playSpeed, setPlaySpeed] = useState<number>();

    useEffect(() => {
        if (interval) {
            clearInterval(interval);
        }
        if (playSpeed !== undefined) {
            interval = setInterval(
                () => dispatch(mapActions.setCurrentTime((timeMirror + playSpeed * 100) % MAX_SLIDER_TIME)),
                100
            );
        }
    }, [playSpeed]);

    if (!dateValue) {
        return null;
    }

    return (
        <div style={sliderStyle}>
            <Form.Group className={'m-2 d-flex'}>
                <div className={'mx-1'}>
                    {dateValue ? formatTimeOnly(dateValue) : intl.formatMessage({ id: 'msg.noCalculatedTracks' })}
                </div>
                <div className={'d-flex mx-2 my-1'}>
                    <Form.Range
                        min={0}
                        max={MAX_SLIDER_TIME}
                        value={mapTime}
                        onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
                    />
                </div>
                <div className={'mx-1 d-flex'}>
                    <Button
                        size={'sm'}
                        variant={'success'}
                        className={'m-1'}
                        style={buttonStyle}
                        disabled={playSpeed === 1}
                        onClick={() => setPlaySpeed(1)}
                        title={intl.formatMessage({ id: 'msg.play.normal' })}
                    >
                        <img src={play} className="m-0" alt="open file" />
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'warning'}
                        className={'m-1'}
                        style={buttonStyle}
                        disabled={playSpeed === 5}
                        onClick={() => setPlaySpeed(5)}
                        title={intl.formatMessage({ id: 'msg.play.fast' })}
                    >
                        <img src={fast} className="m-0" alt="open file" />
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'danger'}
                        className={'m-1'}
                        style={buttonStyle}
                        disabled={!playSpeed}
                        onClick={() => setPlaySpeed(undefined)}
                        title={intl.formatMessage({ id: 'msg.play.stop' })}
                    >
                        <img src={stop} className="m-1" alt="open file" />
                    </Button>
                </div>
            </Form.Group>
        </div>
    );
}
