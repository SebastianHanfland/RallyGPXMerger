import { useState } from 'react';
import { TutorialModal } from './TutorialModal.tsx';
import { Button } from 'react-bootstrap';
import info from '../../assets/info.svg';

export const HelpButton = () => {
    const [showHelp, setShowHelp] = useState(false);
    return (
        <>
            <Button variant={'info'} onClick={() => setShowHelp(true)}>
                <img src={info} className={'m-1'} alt="help" />
                Help/Tutorial
            </Button>
            {showHelp && <TutorialModal closeModal={() => setShowHelp(false)} />}
        </>
    );
};
