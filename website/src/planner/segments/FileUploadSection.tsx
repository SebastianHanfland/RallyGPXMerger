import { GpxSegments } from './GpxSegments.tsx';
import { FormattedMessage } from 'react-intl';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.uploadGpx.title'} />
            </h4>
            <GpxCreationHint />
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
