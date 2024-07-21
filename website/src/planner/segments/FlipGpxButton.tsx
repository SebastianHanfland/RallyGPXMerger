import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import flip from '../../assets/flip.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';

interface Props {
    id: string;
    name: string;
    flipped?: boolean;
}

export function FlipGpxButton({ id, name, flipped }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const flipGpxSegment = () => {
        dispatch(gpxSegmentsActions.flipGpxSegment(id));
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
