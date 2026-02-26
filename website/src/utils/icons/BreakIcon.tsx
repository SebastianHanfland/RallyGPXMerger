import breakIcon from '../../assets/break.svg';

export function BreakIcon({ size }: { size?: number; white?: boolean }) {
    return (
        <img
            src={breakIcon}
            className="m-1"
            alt="breakIcon"
            style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        />
    );
}
