import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { downloadFile } from '../download/FileDownloader.tsx';
import { DownloadIcon } from '../../utils/icons/DownloadIcon.tsx';
import { getPlanningTitle } from '../store/settings.reducer.ts';
import { State } from '../store/types.ts';

export function DownloadDataForCopyButton() {
    const intl = useIntl();
    const state = useSelector((a: State) => a);
    const planningTitle = useSelector(getPlanningTitle) ?? 'RallyGPXMergeState';
    const copy = intl.formatMessage({ id: 'msg.aCopy' });
    const cleanedState = {
        ...state,
        backend: undefined,
        settings: { ...state.settings, planningTitle: copy + state.settings.planningTitle },
    } as State;

    return (
        <>
            <Button
                variant="info"
                title={intl.formatMessage({ id: 'msg.downloadPlanningForCopy.hint' })}
                onClick={() =>
                    downloadFile(
                        `${copy}-${planningTitle}-${new Date().toISOString()}.json`,
                        JSON.stringify(cleanedState)
                    )
                }
            >
                <DownloadIcon size={20} black={true} />
                {intl.formatMessage({ id: 'msg.downloadPlanningForCopy' })}
            </Button>
        </>
    );
}
