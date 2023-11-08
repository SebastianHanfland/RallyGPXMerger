export function HighlightUnknown(props: { value: string }) {
    if (props.value === 'Unknown') {
        return <span style={{ color: 'red', fontWeight: 'bold' }}>{props.value}</span>;
    }
    return <span>{props.value}</span>;
}
