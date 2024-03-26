import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import flip from '../../assets/flip.svg';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    id: string;
    name: string;
    flipped?: boolean;
}

export function FlipGpxButton({ id, name, flipped }: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const flipGpxSegment = () => {
        dispatch(gpxSegmentsActions.flipGpxSegment(id));
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.removeFile.hint' }, { name })}
                onClick={() => flipGpxSegment()}
            >
                <img src={flip} className="m-1" alt="trash" />
                <span>
                    <FormattedMessage id={flipped ? 'msg.unflipGpx' : 'msg.flipGpx'} />
                </span>
            </Dropdown.Item>
        </>
    );
}
