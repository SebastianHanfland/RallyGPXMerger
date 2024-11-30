import { GpxSegments } from './GpxSegments.tsx';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { BlockTextDescription } from '../layout/BlockTextDescription.tsx';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <BlockTextDescription messageId={'msg.description.segments'} />
            <GpxCreationHint />
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
