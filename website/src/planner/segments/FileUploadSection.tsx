import { GpxSegments } from './GpxSegments.tsx';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { useSelector } from 'react-redux';
import { BlockTextDescription } from '../layout/BlockTextDescription.tsx';
import { getParsedGpxSegments } from '../new-store/segmentData.redux.ts';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getParsedGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <BlockTextDescription messageId={'msg.description.segments'} />
            <GpxCreationHint />
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
