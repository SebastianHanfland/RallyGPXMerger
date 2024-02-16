import warning from '../../../assets/warning.svg';

export function Warning({ size }: { size?: number }) {
    return <img src={warning} className="m-1" alt="warning" style={{ width: `${size}px`, height: `${size}px` }} />;
}
