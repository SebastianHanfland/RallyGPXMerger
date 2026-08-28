import { GpxSegments } from './GpxSegments.tsx';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';

export function FileUploadSection() {
    const hasNoGPXSegments = useSelector(getParsedGpxSegments).length === 0;

    return (
        <div className={'p-2 shadow'} style={{ height: '100vh', overflow: 'auto' }}>
            <div className={'d-flex justify-content-end'}>
                <DescriptionInfoButton
                    titleMessageId={'msg.segment'}
                    descriptionMessageId={'msg.description.segments'}
                />
            </div>
            <GpxCreationHint />
            <GpxSegments noFilter={hasNoGPXSegments} />
        </div>
    );
}
