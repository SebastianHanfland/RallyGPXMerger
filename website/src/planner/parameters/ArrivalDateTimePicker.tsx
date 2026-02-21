import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getArrivalDateTime, settingsActions } from '../store/settings.reducer.ts';

export function ArrivalDateTimePicker({ noHeader }: { noHeader?: boolean }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const arrivalDateTime = useSelector(getArrivalDateTime);
    return (
        <div className={'d-inline-block'}>
            {!noHeader && (
                <h6 className="form-label">
                    <FormattedMessage id={'msg.arrivalDate.title'} />
                </h6>
            )}
            <DatePicker
                className={'form-control'}
                dateFormat={'dd.MM.yyyy HH:mm'}
                placeholderText={intl.formatMessage({ id: 'msg.arrivalDate.title' })}
                onChange={(date) => {
                    dispatch(settingsActions.setArrivalDateTime(date?.toISOString() ?? undefined));
                }}
                selected={arrivalDateTime ? new Date(arrivalDateTime) : null}
                isClearable={true}
                locale={'en'}
                calendarStartDay={1}
                timeIntervals={15}
                showTimeSelect={true}
            />
        </div>
    );
}
