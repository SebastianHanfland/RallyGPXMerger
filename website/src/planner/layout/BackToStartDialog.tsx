import { useDispatch } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { resetData } from '../io/resetData.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { ExportStateJson } from '../io/ExportStateJson.tsx';
import { useState } from 'react';
import { Warning } from './dashboard/Warning.tsx';

export function BackToStartDialog(props: { closeModal: () => void }) {
    const dispatch = useDispatch();
    const intl = useIntl();
    const [downloaded, setDownloaded] = useState(false);

    const removeAllData = () => {
        resetData(dispatch);
        props.closeModal();
    };

    return (
        <ConfirmationModal
            onConfirm={removeAllData}
            closeModal={props.closeModal}
            title={intl.formatMessage({ id: 'msg.backToStart.modalTitle' })}
            body={
                <div onClick={() => setDownloaded(true)} className={'text-center'}>
                    <div>
                        <Warning size={50} />
                    </div>
                    <div className={'m-2 mb-4'}>
                        <FormattedMessage id={'msg.backToStart.modalBody'} />
                    </div>
                    <ExportStateJson label={intl.formatMessage({ id: 'msg.downloadPlanning' })} />
                    {!downloaded && (
                        <p>
                            <b>
                                <Warning />
                                <FormattedMessage id={'msg.backToStart.dataHint'} />
                            </b>
                        </p>
                    )}
                    <FormattedMessage id={'msg.backToStart.question'} />
                </div>
            }
        />
    );
}
