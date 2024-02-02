import { Dropdown } from 'react-bootstrap';
import exchange from '../../assets/exchange.svg';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { useDispatch, useSelector } from 'react-redux';
import { ChangeEvent, useEffect, useState } from 'react';
import { optionallyCompress } from '../store/compressHelper.ts';
import { ConfirmationModal } from '../../common/ConfirmationModal.tsx';
import { FileUploader } from 'react-drag-drop-files';
import { FileDisplay } from './FileDisplay.tsx';
import { toGpxSegment } from './GpxSegments.tsx';

interface Props {
    id: string;
    name: string;
}
export function FileChangeButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const replaceProcess = useSelector(getReplaceProcess);

    // const uploadInput = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

    // const buttonClicked = () => {
    //     const current = uploadInput.current;
    //     if (current) {
    //         current.click();
    //     }
    // };

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length === 1) {
            files[0]
                ?.text()
                .then((newContent) =>
                    dispatch(
                        gpxSegmentsActions.changeGpxSegmentContent({ id, newContent: optionallyCompress(newContent) })
                    )
                )
                .then(() => setIsLoading(true))
                .catch(console.error);
        }
    };

    const replaceGpxSegment = () => {
        changeHandler;
    };

    const handleChange = (newFiles: FileList) => {
        Promise.all([...newFiles].map(toGpxSegment)).then((replacementSegments) =>
            dispatch(
                gpxSegmentsActions.setReplaceProcess({
                    targetSegment: replaceProcess!.targetSegment,
                    replacementSegments,
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
                            <FileUploader
                                style={{ width: '100px' }}
                                handleChange={handleChange}
                                name="file"
                                types={['GPX']}
                                multiple={true}
                                label={'Please upload a state file here'}
                            />
                            {(replaceProcess?.replacementSegments ?? []).map((gpxSegment) => (
                                <FileDisplay key={gpxSegment.id} gpxSegment={gpxSegment} />
                            ))}
                        </div>
                    }
                    confirmDisabled={true}
                />
            )}
        </>
    );
}
