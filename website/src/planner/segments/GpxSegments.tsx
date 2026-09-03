import { Form, Table } from 'react-bootstrap';
import { useState } from 'react';
import { GpxSegmentRow } from './GpxSegmentRow.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppDispatch } from '../store/planningStore.ts';
import { GpxSegmentsUploadAndParse } from './GpxSegmentsUploadAndParse.tsx';
import { getFilteredGpxSegments, getSegmentFilterTerm, segmentDataActions } from '../store/segmentData.redux.ts';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';
import { GpxCreationHint } from './GpxCreationHint.tsx';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { calculateDistanceInKm } from '../../common/calculation/aggregated-segments/calculateDistanceInKm.ts';
import { getAggregateStreetsInSegments } from '../../common/calculation/aggregated-segments/aggregatePointsSelector.ts';
import { getSegmentSpeed } from '../tracks/segment-selection/getSegmentInfo.ts';

type SortField = 'name' | 'speed' | 'distance';
type SortDirection = 'ascending' | 'descending';
type UsageFilter = 'all' | 'used' | 'unused';

function compareValues(first: number | string | undefined, second: number | string | undefined): number {
    if (first === undefined && second === undefined) {
        return 0;
    }
    if (first === undefined) {
        return 1;
    }
    if (second === undefined) {
        return -1;
    }
    if (typeof first === 'string' && typeof second === 'string') {
        return first.localeCompare(second);
    }
    return Number(first) - Number(second);
}

interface Props {
    noFilter?: boolean;
}

export function GpxSegments({ noFilter }: Props) {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();
    const filterTerm = useSelector(getSegmentFilterTerm);
    const setFilterTerm = (term: string) => dispatch(segmentDataActions.setFilterTerm(term));
    const segments = useSelector(getFilteredGpxSegments);
    const trackCompositions = useSelector(getTrackCompositions);
    const aggregatedSegments = useSelector(getAggregateStreetsInSegments);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('ascending');
    const [usageFilter, setUsageFilter] = useState<UsageFilter>('all');

    const usedSegmentIds = new Set(trackCompositions.flatMap((track) => track.segments.map((segment) => segment.id)));
    const segmentRows = segments
        .map((segment) => ({
            segment,
            distance: calculateDistanceInKm(segment.points),
            speed: getSegmentSpeed(aggregatedSegments[segment.id]),
            used: usedSegmentIds.has(segment.id),
        }))
        .filter(({ used }) => usageFilter === 'all' || used === (usageFilter === 'used'))
        .sort((first, second) => {
            const firstValue = sortField === 'name' ? first.segment.filename : first[sortField];
            const secondValue = sortField === 'name' ? second.segment.filename : second[sortField];
            const comparison = compareValues(firstValue, secondValue);
            return (
                (sortDirection === 'ascending' ? comparison : -comparison) ||
                first.segment.filename.localeCompare(second.segment.filename)
            );
        });

    const changeSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            setSortField(field);
            setSortDirection('ascending');
        }
    };

    const sortButton = (field: SortField, messageId: string) => (
        <button
            type="button"
            className="btn btn-link p-0 text-reset text-decoration-none"
            onClick={() => changeSort(field)}
            aria-label={intl.formatMessage({ id: messageId })}
        >
            <FormattedMessage id={messageId} />
            {sortField === field && (sortDirection === 'ascending' ? ' ▲' : ' ▼')}
        </button>
    );

    const cycleUsageFilter = () => {
        setUsageFilter(usageFilter === 'all' ? 'used' : usageFilter === 'used' ? 'unused' : 'all');
    };

    const usageFilterLabel = intl.formatMessage({ id: `msg.segmentUsageFilter.${usageFilter}` });

    return (
        <div>
            {!noFilter ? (
                <div className={'my-2 d-flex justify-content-between'}>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.filterSegments' })}
                        value={filterTerm ?? ''}
                        onChange={(value) => setFilterTerm(value.target.value)}
                    />
                    <div className="d-flex align-items-center">
                        <div className="form-check me-2">
                            <input
                                id="segment-usage-filter"
                                className="form-check-input"
                                type="checkbox"
                                checked={usageFilter === 'used'}
                                ref={(element) => {
                                    if (element) element.indeterminate = usageFilter === 'unused';
                                }}
                                onChange={cycleUsageFilter}
                                aria-label={usageFilterLabel}
                            />
                            <label className="form-check-label" htmlFor="segment-usage-filter">
                                {usageFilterLabel}
                            </label>
                        </div>
                        <DescriptionInfoButton
                            titleMessageId={'msg.segment'}
                            descriptionMessageId={'msg.description.segments'}
                        >
                            <GpxCreationHint />
                        </DescriptionInfoButton>
                    </div>
                </div>
            ) : (
                <div>
                    <FormattedMessage id={'msg.description.segments'} />
                    <GpxCreationHint />
                </div>
            )}
            {segmentRows.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }} size="sm">
                    <thead>
                        <tr>
                            <th style={{ width: '100%' }}>{sortButton('name', 'msg.file')}</th>
                            <th style={{ width: '120px', minWidth: '120px' }}>
                                {sortButton('distance', 'msg.distanceInKm')}
                            </th>
                            <th style={{ width: '30%', minWidth: '150px' }}>
                                <FormattedMessage id={'msg.globalSpeed'} />
                            </th>
                            <th style={{ width: '30%', minWidth: '150px' }}>
                                <div className={'d-flex align-items-center justify-content-between'}>
                                    <FormattedMessage id={'msg.customSpeed'} />
                                    <DescriptionInfoButton
                                        titleMessageId={'msg.customSpeed.title'}
                                        descriptionMessageId={'msg.description.customSpeed'}
                                    />
                                </div>
                            </th>
                            <th style={{ width: '30%', minWidth: '150px' }}>
                                {sortButton('speed', 'msg.calculatedSpeed')}
                            </th>
                            <th style={{ width: '70px', minWidth: '70px' }}>
                                <FormattedMessage id={'msg.actions'} />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {segmentRows.length > 5 && (
                            <tr>
                                <td colSpan={6}>
                                    <GpxSegmentsUploadAndParse />
                                </td>
                            </tr>
                        )}
                        {segmentRows.map(({ segment, distance }) => (
                            <GpxSegmentRow key={segment.id} gpxSegment={segment} distance={distance} />
                        ))}
                        <tr>
                            <td colSpan={6}>
                                <GpxSegmentsUploadAndParse />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            ) : (
                <div>
                    <div>
                        <FormattedMessage id={'msg.noFile'} />
                    </div>
                    <div style={{ height: '70px', width: '200px' }}>
                        <GpxSegmentsUploadAndParse />
                    </div>
                </div>
            )}
            <div style={{ height: '200px' }}></div>
        </div>
    );
}
