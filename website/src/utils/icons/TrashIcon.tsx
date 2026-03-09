import trashB from '../../assets/trashB.svg';
import trash from '../../assets/trash.svg';

export function TrashIcon({ size, white }: { size?: number; white?: boolean }) {
    return (
        <img
            src={white ? trash : trashB}
            className="m-1"
            alt="warning"
            style={{ width: `${size}px`, height: `${size}px` }}
        />
    );
}
