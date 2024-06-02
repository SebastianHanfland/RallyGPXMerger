import { FormattedMessage } from 'react-intl';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';
import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';

export function SimpleFileUploadSection() {
    return (
        <div className={'p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.uploadGpx.title'} />
            </h4>
            <GpxCreationHint />
            <SimpleGpxSegments />
        </div>
    );
}
