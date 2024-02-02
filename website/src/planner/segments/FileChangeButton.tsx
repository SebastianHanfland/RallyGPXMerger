import { Dropdown, Table } from 'react-bootstrap';
import exchange from '../../assets/exchange.svg';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileUploader } from 'react-drag-drop-files';
import { toGpxSegment } from './GpxSegments.tsx';
import { executeGpxSegmentReplacement } from './fileReplaceThunk.ts';
import { AppDispatch } from '../store/store.ts';
import { ReplaceFileDisplay } from './ReplaceFileDisplay.tsx';

interface Props {
    id: string;
    name: string;
}
export function FileChangeButton({ id, name }: Props) {
    const dispatch: AppDispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const replaceProcess = useSelector(getReplaceProcess);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

    const replaceGpxSegment = () => dispatch(executeGpxSegmentReplacement);

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((replacementSegments) =>
            dispatch(
                gpxSegmentsActions.setReplaceProcess({
                    targetSegment: replaceProcess!.targetSegment,
                    replacementSegments: [...replaceProcess!.replacementSegments, ...replacementSegments],
                })
            )
        );
    };

    return (
        <>
            <Dropdown.Item
                onClick={() => {
                    setShowModal(true);
                    dispatch(gpxSegmentsActions.setReplaceProcess({ targetSegment: id, replacementSegments: [] }));
                }}
                title={`Change file for the segment "${name}"`}
            >
                <img src={exchange} alt="exchange" className="m-1" />
                <span>Replace segment with other file(s)</span>
            </Dropdown.Item>
            {showModal && (
                <ConfirmationModal
                    onConfirm={replaceGpxSegment}
                    closeModal={() => setShowModal(false)}
                    title={'Replace Gpx Segment'}
                    body={
                        <div>
                            <h6>Upload one or more new files</h6>
                            <Table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '100%' }}>File</th>
                                        <th style={{ width: '38px', minWidth: '38px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(replaceProcess?.replacementSegments ?? []).map((gpxSegment) => (
                                        <ReplaceFileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                                    ))}
                                </tbody>
                            </Table>
                            <FileUploader
                                style={{ width: '100px' }}
                                handleChange={handleChange}
                                name="file"
                                types={['GPX']}
                                multiple={true}
                                label={'Please upload a state file here'}
                            />
                        </div>
                    }
                    confirmDisabled={true}
                />
            )}
        </>
    );
}
