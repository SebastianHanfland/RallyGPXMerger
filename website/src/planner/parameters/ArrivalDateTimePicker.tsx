import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getArrivalDateTime, trackMergeActions } from '../store/trackMerge.reducer.ts';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage } from 'react-intl';

export function ArrivalDateTimePicker() {
    const dispatch = useDispatch();
    const arrivalDateTime = useSelector(getArrivalDateTime);
    return (
        <div className={'d-inline-block'}>
            <h5 className="form-label m-3">
                <FormattedMessage id={'msg.arrivalDate.title'} />
            </h5>
            <p>
                <FormattedMessage id={'msg.arrivalDate.hint'} />
            </p>
            <DatePicker
                className={'form-control'}
                dateFormat={'dd.MM.yyyy HH:mm'}
                onChange={(date) => dispatch(trackMergeActions.setArrivalDateTime(date?.toISOString() ?? undefined))}
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
