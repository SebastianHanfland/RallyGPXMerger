import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { getLanguage } from '../../language.ts';

interface Props {
    value: string | undefined;
    setValue: (value: Date | undefined | null) => void;
    messageKey: string;
}

export function DateTimePicker({ messageKey, setValue, value }: Props) {
    const intl = useIntl();

    return (
        <div className={'d-inline-block'}>
            <h6 className="form-label">
                <FormattedMessage id={messageKey} />
            </h6>
            <DatePicker
                className={'form-control'}
                dateFormat={'dd.MM.yyyy HH:mm'}
                placeholderText={intl.formatMessage({ id: messageKey })}
                onChange={setValue}
                selected={value ? new Date(value) : null}
                isClearable={true}
                locale={getLanguage()}
                calendarStartDay={1}
                popperPlacement={'left'}
                timeIntervals={15}
                showTimeSelect={true}
            />
        </div>
    );
}
