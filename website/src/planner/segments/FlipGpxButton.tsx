import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import flip from '../../assets/flip.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { getAverageSpeedInKmH } from '../store/trackMerge.reducer.ts';

interface Props {
    id: string;
    name: string;
    flipped?: boolean;
}

export function FlipGpxButton({ id, name, flipped }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const averageSpeed = useSelector(getAverageSpeedInKmH);
    const flipGpxSegment = () => {
        dispatch(segmentDataActions.flipGpxSegment({ segmentId: id, averageSpeed }));
        dispatch(triggerAutomaticCalculation);
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.flipGpx.hint' }, { name })}
                onClick={() => flipGpxSegment()}
            >
                <img src={flip} className="m-1" alt="flip" />
                <span>
                    <FormattedMessage id={flipped ? 'msg.unflipGpx' : 'msg.flipGpx'} />
                </span>
            </Dropdown.Item>
        </>
    );
}
