import nodeIcon from '../../assets/mergeTracks.svg';

export function NodeIcon({ size }: { size?: number }) {
    return <img src={nodeIcon} className="m-1" alt="node" style={{ width: `${size}px`, height: `${size}px` }} />;
}
