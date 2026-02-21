import download from '../../assets/file-down.svg';
import downloadB from '../../assets/file-downB.svg';

export function DownloadIcon({ size, color, black }: { size?: number; color?: string; black?: true }) {
    return (
        <img
            src={black ? downloadB : download}
            alt="download file"
            className={'m-1'}
            color={black ? '#000000' : color ?? '#ffffff'}
            style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
        />
    );
}
