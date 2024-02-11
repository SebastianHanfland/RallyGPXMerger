import { useIntl } from 'react-intl';

export function HighlightUnknown(props: { value: string }) {
    const intl = useIntl();
    if (props.value === intl.formatMessage({ id: 'msg.unknown' })) {
        return <span style={{ color: 'red', fontWeight: 'bold' }}>{props.value}</span>;
    }
    return <span>{props.value}</span>;
}
