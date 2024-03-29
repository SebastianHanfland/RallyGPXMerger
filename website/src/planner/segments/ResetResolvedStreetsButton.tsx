import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import clear from '../../assets/clear.svg';
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
    id: string;
    name: string;
    streetsResolved?: boolean;
}

export function ResetResolvedStreetsButton({ id, name, streetsResolved }: Props) {
    if (!streetsResolved) {
        return null;
    }
    const intl = useIntl();
    const dispatch = useDispatch();
    const flipGpxSegment = () => {
        dispatch(gpxSegmentsActions.setSegmentStreetsResolved({ id, streetsResolved: false }));
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.resetStreets.hint' }, { name })}
                onClick={() => flipGpxSegment()}
            >
                <img src={clear} className="m-1" alt="clear" />
                <span>
                    <FormattedMessage id={'msg.resetStreets'} />
                </span>
            </Dropdown.Item>
        </>
    );
}
