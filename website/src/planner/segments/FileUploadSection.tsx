import { GpxSegments } from './GpxSegments.tsx';
import { FormattedMessage } from 'react-intl';
import { GpxCreationHint } from './GpxCreationHint.tsx';

export function FileUploadSection() {
    return (
        <div className={'p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.uploadGpx.title'} />
            </h4>
            <GpxCreationHint />
            <GpxSegments />
        </div>
    );
}
