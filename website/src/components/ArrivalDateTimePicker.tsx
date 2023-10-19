import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { getArrivalDateTime, trackMergeActions } from '../store/trackMerge.reducer.ts';
import 'react-datepicker/dist/react-datepicker.css';

export function ArrivalDateTimePicker() {
    const dispatch = useDispatch();
    const arrivalDateTime = useSelector(getArrivalDateTime);
    return (
        <div className={'m-3'}>
            <label className="form-label">Arrival of tracks</label>
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
