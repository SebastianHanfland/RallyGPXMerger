import { Dropdown, Table } from 'react-bootstrap';
import exchange from '../../assets/exchange.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { executeGpxSegmentReplacementWithUpload } from './fileReplaceWithUploadThunk.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { ReplaceFileDisplay } from './ReplaceFileDisplay.tsx';
import { FormattedMessage, useIntl } from 'react-intl';
import { getReplaceProcess, segmentDataActions } from '../store/segmentData.redux.ts';
import { ReplacementSegmentSelect } from './ReplacementSegmentSelect.tsx';

interface Props {
    id: string;
    name: string;
}
export function FileChangeButton({ id, name }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const replaceProcess = useSelector(getReplaceProcess);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

    const replaceGpxSegment = () => {
        dispatch(executeGpxSegmentReplacementWithUpload);
        setShowModal(false);
    };

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    setShowModal(true);
                    dispatch(segmentDataActions.setReplaceProcess({ targetSegment: id, replacementSegments: [] }));
                }}
                title={intl.formatMessage({ id: 'msg.replaceFileWithExisting.hint' }, { name })}
            >
                <img src={exchange} alt="exchange" className="m-1" />
                <span>
                    <FormattedMessage id={'msg.replaceFileWithExisting'} />
                </span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={replaceGpxSegment}
                    closeModal={() => setShowModal(false)}
                    title={intl.formatMessage({ id: 'msg.replaceSegment.modalTitle' })}
                    body={
                        <div>
                            <h6>
                                <FormattedMessage id={'msg.replaceSegment.modalBody'} />
                            </h6>
                            {(replaceProcess?.replacementSegments?.length ?? 0) > 0 && (
                                <Table>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '100%' }}>
                                                <FormattedMessage id={'msg.file'} />
                                            </th>
                                            <th style={{ width: '38px', minWidth: '38px' }}>
                                                <FormattedMessage id={'msg.actions'} />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(replaceProcess?.replacementSegments ?? []).map((gpxSegment) => (
                                            <ReplaceFileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                            <ReplacementSegmentSelect />
                        </div>
                    }
                    confirmDisabled={(replaceProcess?.replacementSegments.length || 0) === 0}
                />
            )}
        </>
    );
}
