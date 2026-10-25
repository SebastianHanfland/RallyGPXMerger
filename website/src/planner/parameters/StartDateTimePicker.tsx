import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store/planningStore';
import { getStartDate, settingsActions } from '../store/settings.reducer';
import { DateTimePicker } from './DateTimePicker';

export function StartDateTimePicker() {
    const dispatch: AppDispatch = useDispatch();
    const startDate = useSelector(getStartDate);
    const setValue = (value: Date | undefined | null) => {
        dispatch(settingsActions.setStartDate(value?.toISOString() ?? undefined));
    };
    return <DateTimePicker value={startDate} setValue={setValue} messageKey={'msg.startDate.title'} />;
}
