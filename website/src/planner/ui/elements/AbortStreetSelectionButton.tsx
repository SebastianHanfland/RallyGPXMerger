import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { useEffect } from 'react';
import { CancelIcon } from '../../../utils/icons/CancelIcon.tsx';
import { getStreetPointSelection } from '../../store/map.reducer.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { abortStreetSelection } from '../../streets/streetEditing.ts';

export function AbortStreetSelectionButton() {
    const selection = useSelector(getStreetPointSelection);
    const dispatch: AppDispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        if (!selection) {
            return;
        }

        const abortOnEscape = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') {
                return;
            }
            event.preventDefault();
            abortStreetSelection(dispatch, selection);
        };

        document.addEventListener('keydown', abortOnEscape);
        return () => document.removeEventListener('keydown', abortOnEscape);
    }, [dispatch, selection]);

    if (!selection) {
        return null;
    }

    const label = intl.formatMessage({ id: 'msg.abortStreetAssignment' });
    return (
        <Button
            variant="danger"
            type="button"
            title={label}
            aria-label={label}
            onClick={() => abortStreetSelection(dispatch, selection)}
            style={{ width: '45px', height: '45px', padding: 0 }}
        >
            <CancelIcon />
        </Button>
    );
}
