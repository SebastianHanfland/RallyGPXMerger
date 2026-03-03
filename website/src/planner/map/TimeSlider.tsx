import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrenMapTime, mapActions } from '../store/map.reducer.ts';
import { getCurrentTimeStamp } from './hooks/trackSimulationReader.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { CSSProperties, useEffect, useState } from 'react';
import play from '../../assets/play.svg';
import stop from '../../assets/stop.svg';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { useIntl } from 'react-intl';
import { getIsSidebarOpen } from '../store/layout.reducer.ts';
import { getCount } from '../../utils/inputUtil.ts';

let interval: NodeJS.Timeout | undefined;

let timeMirror = 0;

function getSliderStyle(isSidebarOpen: boolean): CSSProperties {
    return {
        position: 'fixed',
        width: isSidebarOpen ? 'calc(50vw - 70px)' : 'calc(100vw - 100px)',
        height: '45px',
        borderRadius: '10px',
        left: 60,
        bottom: 10,
        zIndex: 10,
        backgroundColor: 'white',
        overflow: 'hidden',
        cursor: 'pointer',
    };
}

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
    const isSidebarOpen = useSelector(getIsSidebarOpen);
    timeMirror = mapTime;
    const dispatch = useDispatch();

    const [playSpeed, setPlaySpeed] = useState<number>(100);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        if (interval) {
            clearInterval(interval);
        }
        if (isPlaying && playSpeed !== undefined) {
            interval = setInterval(
                () => dispatch(mapActions.setCurrentTime((timeMirror + playSpeed) % MAX_SLIDER_TIME)),
                100
            );
        }
    }, [playSpeed, isPlaying]);

    if (!dateValue) {
        return null;
    }

    return (
        <div style={getSliderStyle(isSidebarOpen)}>
            <Form.Group className={'m-2 d-flex'}>
                <div className={'mx-1'} style={{ width: '120px' }}>
                    {dateValue ? formatTimeOnly(dateValue) : intl.formatMessage({ id: 'msg.noCalculatedTracks' })}
                </div>
                <div className={'d-flex mx-2 my-1 flex-fill'}>
                    <Form.Range
                        min={0}
                        max={MAX_SLIDER_TIME}
                        value={mapTime}
                        onChange={(event) => dispatch(mapActions.setCurrentTime(Number(event.target.value)))}
                    />
                </div>
                <div className={'mx-1 d-flex'}>
                    {!isPlaying ? (
                        <Button
                            size={'sm'}
                            variant={'success'}
                            className={'m-1'}
                            style={buttonStyle}
                            onClick={() => setIsPlaying(true)}
                            title={intl.formatMessage({ id: 'msg.play.normal' })}
                        >
                            <img src={play} className="m-0" alt="open file" />
                        </Button>
                    ) : (
                        <Button
                            size={'sm'}
                            variant={'danger'}
                            className={'m-1'}
                            style={buttonStyle}
                            onClick={() => setIsPlaying(false)}
                            title={intl.formatMessage({ id: 'msg.play.stop' })}
                        >
                            <img src={stop} className="m-1" alt="open file" />
                        </Button>
                    )}
                    <div
                        style={{ marginTop: '-4px', width: '90px', marginRight: '-8px', marginLeft: '5px' }}
                        title={intl.formatMessage({ id: 'msg.speedCounter' })}
                    >
                        <Form.Control
                            type="number"
                            step={1}
                            min={1}
                            max={1000}
                            value={playSpeed ?? ''}
                            onChange={(value) => {
                                const extractedValue = getCount(value);
                                extractedValue ? setPlaySpeed(extractedValue) : setPlaySpeed(1);
                            }}
                        />
                    </div>
                </div>
            </Form.Group>
        </div>
    );
}
