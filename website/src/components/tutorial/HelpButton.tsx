import { useState } from 'react';
import { TutorialModal } from './TutorialModal.tsx';
import { Button } from 'react-bootstrap';

export const HelpButton = () => {
    const [showHelp, setShowHelp] = useState(false);
    return (
        <>
            <Button variant={'info'} onClick={() => setShowHelp(true)}>
                Help/Tutorial
            </Button>
            {showHelp && <TutorialModal closeModal={() => setShowHelp(false)} />}
        </>
    );
};
