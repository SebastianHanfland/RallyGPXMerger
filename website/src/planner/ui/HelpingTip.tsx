import { CSSProperties } from 'react';
import { useHelpingHook } from './helpingHook.ts';
import hand from '../../assets/hand.svg';

const helpingTipStyle: CSSProperties = {
    position: 'fixed',
    width: '40vw',
    borderRadius: '2px',
    left: 80,
    top: 10,
    zIndex: 200,
    backgroundColor: 'white',
    paddingTop: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

const size = 15;

export function HelpingTip() {
    const [title, message, callback] = useHelpingHook();

    return (
        <div style={helpingTipStyle} className={'shadow'} onClick={callback}>
            <img src={hand} className="m-1" alt="warning" style={{ width: `${size}px`, height: `${size}px` }} />
            <b>{title}</b>: {' ' + message}
        </div>
    );
}
