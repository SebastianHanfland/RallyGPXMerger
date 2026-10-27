import { FormattedMessage } from 'react-intl';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton';
import { GpxCreationHint } from './GpxCreationHint';
import { SegmentFilter } from './table/SegmentFilter';
import { SegmentUsageFilter } from './table/SegmentUsageFilter';
import { GpxSegmentsTable } from './table/GpxSegmentsTable';

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    return (
        <div>
            {!noFilter ? (
                <div className="mb-2 d-flex justify-content-between">
                    <SegmentFilter />
                    <div className="d-flex align-items-center">
                        <SegmentUsageFilter />
                        <DescriptionInfoButton
                            titleMessageId="msg.segment"
                            descriptionMessageId="msg.description.segments"
                        >
                            <GpxCreationHint />
                        </DescriptionInfoButton>
                    </div>
                </div>
            ) : (
                <div>
                    <FormattedMessage id="msg.description.segments" />
                    <GpxCreationHint />
                </div>
            )}
            <GpxSegmentsTable />
            <div style={{ height: '200px' }}></div>
        </div>
    );
}
