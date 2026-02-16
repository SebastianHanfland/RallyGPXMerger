import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import clear from '../../assets/clear.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { successNotification } from '../store/toast.reducer.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { resolveStreetNames } from '../logic/resolving/streets/resolveStreetNames.ts';

interface Props {
    id: string;
    name: string;
    streetsResolved?: boolean;
}

export function ResetResolvedStreetsButton({ id, name }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const resetStreets = () => {
        dispatch(segmentDataActions.setSegmentStreetsResolved({ id, streetsResolved: false }));
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
