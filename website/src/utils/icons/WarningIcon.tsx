import warningW from '../../assets/warningW.svg';
import warning from '../../assets/warning.svg';

export function WarningIcon({ size, white }: { size?: number; white?: boolean }) {
    return (
        <img
            src={white ? warningW : warning}
            className="m-1"
            alt="warning"
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
}
