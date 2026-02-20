export const ColorBlob = ({ color }: { color: string }) => {
    return <span className={'rounded-2 px-2 mx-1'} style={{ backgroundColor: color, color: color }}></span>;
};
