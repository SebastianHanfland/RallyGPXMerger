import { FileDownloader } from '../FileDownloader';
import { useSelector } from 'react-redux';
import { getPlanningTitle } from '../../store/settings.reducer';

export function ExportStateJson({ label }: { label: string }) {
    const state = useSelector((a) => a);
    const planningTitle = useSelector(getPlanningTitle) ?? 'RallyGPXMergeState';

    return (
        <FileDownloader
            onlyIcon={true}
            name={`${planningTitle}-${new Date().toISOString()}.json`}
            label={label}
            content={JSON.stringify(state)}
            id={'state-down'}
        />
    );
}
