import { useIntl } from 'react-intl';
import { Button } from 'react-bootstrap';
import { CSSProperties } from 'react';
import info from '../../assets/info.svg';

const infoButtonStyle: CSSProperties = {
    position: 'fixed',
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    left: 70,
    bottom: 50,
    zIndex: 10,
    overflow: 'hidden',
    cursor: 'pointer',
};

export const HelpButton = () => {
    const intl = useIntl();
    return (
        <Button
            style={infoButtonStyle}
            className={'m-0 p-0'}
            variant="info"
            title={intl.formatMessage({ id: 'msg.helpButton.hint' })}
        >
            <img src={info} className="m-1" alt="trash" style={{ height: '30px', width: '30px' }} />
        </Button>
    );
};
