import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { StreetPointSelection } from '../../../../store/types';
import { AppDispatch } from '../../../../store/planningStore';
import { abortStreetSelection } from '../../../../streets/streetEditing';
import { CancelIcon } from '../../../../../utils/icons/CancelIcon';

interface Props {
    positions: number[];
    trackId: string;
    selection: StreetPointSelection | undefined;
    dispatch: AppDispatch;
    onStart: (index: number) => void;
}

export const StreetInsertionRail = ({ positions, trackId, selection, dispatch, onStart }: Props) => {
    const intl = useIntl();
    return (
        <div
            data-testid="street-insertion-rail"
            className="position-absolute"
            style={{ left: 0, top: 0, bottom: 0, width: '2.5rem' }}
        >
            {positions.map((position, insertionIndex) => {
                const active =
                    selection?.trackId === trackId &&
                    selection.mode?.startsWith('add-') &&
                    selection.insertionIndex === insertionIndex;
                return (
                    <Button
                        key={insertionIndex}
                        type="button"
                        variant="outline-secondary"
                        size="sm"
                        title={intl.formatMessage({ id: active ? 'msg.cancelAddStreet' : 'msg.addStreet' })}
                        aria-label={intl.formatMessage({ id: active ? 'msg.cancelAddStreet' : 'msg.addStreet' })}
                        onClick={() => (active ? abortStreetSelection(dispatch, selection) : onStart(insertionIndex))}
                        className="p-0"
                        style={{
                            position: 'absolute',
                            left: '0.25rem',
                            top: `${position}px`,
                            transform: 'translateY(-50%)',
                            width: '2rem',
                            height: '2rem',
                            lineHeight: 1,
                            borderRadius: '0.25rem',
                        }}
                    >
                        {active ? <CancelIcon /> : '+'}
                    </Button>
                );
            })}
        </div>
    );
};
