import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { getStartDate, settingsActions } from '../store/settings.reducer.ts';

export function StartDateTimePicker({ noHeader }: { noHeader?: boolean }) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const startDate = useSelector(getStartDate);
    return (
        <div className={'d-inline-block'}>
            {!noHeader && (
                <h6 className="form-label">
                    <FormattedMessage id={'msg.startDate.title'} />
                </h6>
            )}
            <DatePicker
                className={'form-control'}
                dateFormat={'dd.MM.yyyy HH:mm'}
                placeholderText={intl.formatMessage({ id: 'msg.startDate.title' })}
                onChange={(date: Date | undefined | null) => {
                    dispatch(settingsActions.setStartDate(date?.toISOString() ?? undefined));
                }}
                selected={startDate ? new Date(startDate) : null}
                isClearable={true}
                locale={'en'}
                calendarStartDay={1}
                timeIntervals={15}
                showTimeSelect={true}
            />
        </div>
    );
}
