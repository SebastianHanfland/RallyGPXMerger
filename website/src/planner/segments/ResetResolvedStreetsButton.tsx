import { useDispatch } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import clear from '../../assets/clear.svg';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { successNotification } from '../store/toast.reducer.ts';
import { resolveStreetNames } from '../logic/resolving/streets/resolveStreetNames.ts';

interface Props {
    id: string;
    name: string;
    onAction?: () => void;
}

export function ResetResolvedStreetsButton({ id, name, onAction }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const resetStreets = () => {
        dispatch(resolveStreetNames(id)).then(() => {
            successNotification(
                dispatch,
                intl.formatMessage({ id: 'msg.streetsResolved' }),
                intl.formatMessage({ id: 'msg.streetsResolved' })
            );
            onAction?.();
        });
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
