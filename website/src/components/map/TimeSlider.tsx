import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from '../../planner/store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../planner/store/types.ts';
import { getCurrentTimeStamp } from './hooks/trackSimulationReader.ts';
import { formatDate } from '../../utils/dateUtil.ts';
import { useEffect, useState } from 'react';
import play from '../../assets/play.svg';
import fast from '../../assets/fast.svg';
import stop from '../../assets/stop.svg';

let interval: NodeJS.Timeout | undefined;

let timeMirror = 0;

export function TimeSlider() {
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

    return (
        <Form.Group className={'m-2'}>
            <div>{dateValue ? formatDate(dateValue) : 'No tracks yet calculated'}</div>
            <div className={'d-flex'}>
                <Form.Range
                    min={0}
                    max={MAX_SLIDER_TIME}
                    value={mapTime}
                    onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
                />
                <div className={'mx-4 d-flex'}>
                    <Button
                        size={'sm'}
                        variant={'success'}
                        className={'m-1'}
                        onClick={() => setPlaySpeed(1)}
                        title={'Play the rally simulation'}
                    >
                        <img src={play} className="m-1" alt="open file" />
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'warning'}
                        className={'m-1'}
                        onClick={() => setPlaySpeed(5)}
                        title={'Play the rally simulation fast'}
                    >
                        <img src={fast} className="m-1" alt="open file" />
                    </Button>
                    <Button
                        size={'sm'}
                        variant={'danger'}
                        className={'m-1'}
                        onClick={() => setPlaySpeed(undefined)}
                        title={'Stop the rally simulation'}
                    >
                        <img src={stop} className="m-1" alt="open file" />
                    </Button>
                </div>
            </div>
        </Form.Group>
    );
}
