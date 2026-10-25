interface Props {
    color: string;
    size?: string;
}

export const ColorBlob = ({ color, size }: Props) => {
    const usedSize = size ?? '5px';
    return (
        <span
            className={'rounded-2 p-2 mx-1'}
            style={{
                display: 'inline-block',
                cursor: 'pointer',
                backgroundColor: color,
                color: color,
                height: usedSize ? usedSize : undefined,
                width: usedSize ? usedSize : undefined,
            }}
        ></span>
    );
};
