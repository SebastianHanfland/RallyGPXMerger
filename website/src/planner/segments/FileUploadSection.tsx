import { GpxSegments } from './GpxSegments.tsx';
import { useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getParsedGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
