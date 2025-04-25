import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import clear from '../../assets/clear.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { resolveStreetNames } from '../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { successNotification } from '../store/toast.reducer.ts';

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
    const dispatch: AppDispatch = useDispatch();
    const resetStreets = () => {
        dispatch(gpxSegmentsActions.setSegmentStreetsResolved({ id, streetsResolved: false }));
        dispatch(resolveStreetNames).then(() =>
            successNotification(
                dispatch,
                intl.formatMessage({ id: 'msg.streetsResolved' }),
                intl.formatMessage({ id: 'msg.streetsResolved' })
            )
        );
    };
    return (
        <>
            <Dropdown.Item
                title={intl.formatMessage({ id: 'msg.resetStreets.hint' }, { name })}
                onClick={() => resetStreets()}
            >
                <img src={clear} className="m-1" alt="clear" />
                <span>
                    <FormattedMessage id={'msg.resetStreets'} />
                </span>
            </Dropdown.Item>
        </>
    );
}
