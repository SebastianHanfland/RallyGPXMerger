import { useDispatch, useSelector } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import { AppDispatch } from '../store/planningStore.ts';
import { getArrivalDateTime, settingsActions } from '../store/settings.reducer.ts';
import { DateTimePicker } from './DateTimePicker.tsx';

export function ArrivalDateTimePicker() {
    const dispatch: AppDispatch = useDispatch();
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const setValue = (value: Date | undefined | null) => {
        dispatch(settingsActions.setArrivalDateTime(value?.toISOString() ?? undefined));
    };
    return <DateTimePicker value={arrivalDateTime} setValue={setValue} messageKey={'msg.arrivalDate.title'} />;
}
