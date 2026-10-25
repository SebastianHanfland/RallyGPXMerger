import { GpxSegments } from './GpxSegments';
import { useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../store/segmentData.redux';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getParsedGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
