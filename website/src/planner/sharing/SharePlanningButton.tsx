import { Button } from 'react-bootstrap';
import { CSSProperties } from 'react';
import shareIcon from '../../assets/share.svg';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getIsPlanningAlreadySaved } from '../store/backend.reducer.ts';
import { layoutActions } from '../store/layout.reducer.ts';

const sharePlanningStyle1: CSSProperties = {
    width: '45px',
    height: '45px',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
};

export function SharePlanningButton({ onMap }: { onMap?: boolean }) {
    const isPlanningAlreadySaved = useSelector(getIsPlanningAlreadySaved);
    const intl = useIntl();
    const dispatch = useDispatch();

    if (!isPlanningAlreadySaved) {
        return null;
    }

    const buttonSize = onMap ? '30px' : '20px';
    return (
        <>
            <Button
                style={onMap ? sharePlanningStyle1 : undefined}
                className={onMap ? 'm-0 p-0' : undefined}
                variant="info"
                title={intl.formatMessage({ id: 'msg.sharingLink.hint' })}
                onClick={() => dispatch(layoutActions.setIsShareModalOpen(true))}
            >
                <img src={shareIcon} className="m-1" alt="fileUp" style={{ height: buttonSize, width: buttonSize }} />
                {!onMap && intl.formatMessage({ id: 'msg.sharingLink.hint' })}
            </Button>
        </>
    );
}
