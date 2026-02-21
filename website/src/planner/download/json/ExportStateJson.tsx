import { FileDownloader } from '../FileDownloader.tsx';
import { useSelector } from 'react-redux';

export function ExportStateJson({ label }: { label: string }) {
    const state = useSelector((a) => a);

    return (
        <FileDownloader
            onlyIcon={true}
            name={`RallyGPXMergeState-${new Date().toISOString()}.json`}
            label={label}
            content={JSON.stringify(state)}
            id={'state-down'}
        />
    );
}
