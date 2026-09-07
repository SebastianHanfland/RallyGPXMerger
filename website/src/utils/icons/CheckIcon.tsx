import checkIcon from '../../assets/check-circle.svg';

export function CheckIcon({ size }: { size?: number }) {
    return <img src={checkIcon} className="m-1" alt="checkIcon" style={{ width: `${size}px`, height: `${size}px` }} />;
}
