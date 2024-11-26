import { CSSProperties } from 'react';
import { Warning } from '../layout/dashboard/Warning.tsx';
import { useHelpingHook } from './helpingHook.ts';

const helpingTipStyle: CSSProperties = {
    position: 'fixed',
    width: '650px',
    borderRadius: '2px',
    left: 80,
    top: 10,
    zIndex: 10,
    backgroundColor: 'white',
    paddingTop: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    color: 'red',
};

export function HelpingTip() {
    const [title, message, callback] = useHelpingHook();

    return (
        <div style={helpingTipStyle} className={'shadow'} onClick={callback}>
            <Warning />
            <b>{title}</b>: {' ' + message}
        </div>
    );
}
