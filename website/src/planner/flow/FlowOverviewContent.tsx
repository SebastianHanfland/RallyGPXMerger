import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { FlowLayout, FlowPointLayout, layoutFlowGraph, getFlowOverviewGraph } from './flowGraph.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import breakIcon from '../../assets/break.svg';
import arrowRightIcon from '../../assets/arrow-right.svg';

function getRibbonPath(source: FlowPointLayout, target: FlowPointLayout): string {
    const middleX = source.x + (target.x - source.x) / 2;
    const sourceTop = source.y - source.width / 2;
    const sourceBottom = source.y + source.width / 2;
    const targetTop = target.y - target.width / 2;
    const targetBottom = target.y + target.width / 2;

    return [
        `M ${source.x} ${sourceTop}`,
        `C ${middleX} ${sourceTop}, ${middleX} ${targetTop}, ${target.x} ${targetTop}`,
        `L ${target.x} ${targetBottom}`,
        `C ${middleX} ${targetBottom}, ${middleX} ${sourceBottom}, ${source.x} ${sourceBottom}`,
        'Z',
    ].join(' ');
}

function toIsoTime(time: number): string {
    return new Date(time).toISOString();
}

function getEventLabel(
    layout: FlowLayout['events'][number],
    formatMessage: ReturnType<typeof useIntl>['formatMessage']
) {
    if (layout.kind === 'break') {
        return formatMessage(
            { id: 'msg.flowOverview.breakLabel' },
            { minutes: layout.minutes ?? 0, time: formatTimeOnly(toIsoTime(layout.time), true) }
        );
    }
    return formatMessage({ id: 'msg.flowOverview.entryLabel' }, { time: formatTimeOnly(toIsoTime(layout.time), true) });
}

function getX(layout: FlowLayout, time: number): number {
    const timeRange = Math.max(1, layout.endTime - layout.startTime);
    return (
        layout.leftMargin +
        ((Math.max(layout.startTime, Math.min(layout.endTime, time)) - layout.startTime) / timeRange) *
            (layout.width - layout.leftMargin - layout.rightMargin)
    );
}

function FlowLegend({ layout }: { layout: FlowLayout }) {
    const intl = useIntl();
    const people = intl.formatMessage({ id: 'msg.people' });

    return (
        <div
            className="d-flex flex-wrap gap-3 mb-3"
            aria-label={intl.formatMessage({ id: 'msg.flowOverview.legend' })}
            data-testid="flow-overview-legend"
        >
            {layout.starts.map((start) => {
                const track = layout.groups
                    .flatMap((group) => group.colorParts)
                    .find((part) => part.trackId === start.trackId);
                return (
                    <span key={start.trackId} className="d-inline-flex align-items-center">
                        <span
                            className="rounded-2 me-1"
                            style={{
                                width: '1.25rem',
                                height: '0.75rem',
                                backgroundColor: track?.color ?? start.color,
                            }}
                        />
                        <span>{`${start.name} (${start.peopleCount} ${people})`}</span>
                    </span>
                );
            })}
        </div>
    );
}

function FlowGraphSvg({ layout }: { layout: FlowLayout }) {
    const intl = useIntl();
    const trackNames = new Map(layout.starts.map((start) => [start.trackId, start.name]));

    return (
        <svg
            role="img"
            aria-label={intl.formatMessage({ id: 'msg.flowOverview.graphLabel' })}
            data-testid="flow-overview-graph"
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            style={{ width: `${layout.width}px`, maxWidth: 'none', backgroundColor: '#fafafa' }}
        >
            <g aria-hidden="true">
                {layout.ticks.map((tick) => (
                    <line
                        key={tick}
                        x1={getX(layout, tick)}
                        x2={getX(layout, tick)}
                        y1={40}
                        y2={layout.axisY}
                        stroke="#dee2e6"
                        strokeDasharray="3 5"
                    />
                ))}
            </g>

            {layout.connections.concat(layout.finishConnections).map((connection) => (
                <path
                    key={connection.id}
                    d={getRibbonPath(connection.source, connection.target)}
                    fill={connection.color}
                    fillOpacity={0.75}
                    stroke={connection.color}
                    strokeOpacity={0.2}
                >
                    <title>{trackNames.get(connection.trackId) ?? connection.trackId}</title>
                </path>
            ))}

            {layout.groups.map((group) => (
                <g key={group.id}>
                    {group.colorParts.map((part) => (
                        <rect
                            key={`${group.id}:${part.trackId}`}
                            x={group.xStart}
                            y={part.y - part.height / 2}
                            width={Math.max(1, group.xEnd - group.xStart)}
                            height={Math.max(1, part.height)}
                            fill={part.color}
                            fillOpacity={0.85}
                            rx={Math.min(4, part.height / 2)}
                        >
                            <title>{trackNames.get(part.trackId) ?? part.trackId}</title>
                        </rect>
                    ))}
                </g>
            ))}

            {layout.starts.map((start) => (
                <g key={`start:${start.trackId}`}>
                    <line
                        x1={start.x}
                        x2={start.x}
                        y1={start.y - 12}
                        y2={start.y + 12}
                        stroke={start.color}
                        strokeWidth={2}
                    />
                    <text x={start.x - 8} y={start.y + 4} textAnchor="end" fontSize={12}>
                        {trackNames.get(start.trackId) ?? start.trackId}
                    </text>
                </g>
            ))}

            {layout.merges.map((merge) => (
                <g key={merge.id} data-testid="flow-overview-node">
                    <circle cx={merge.x} cy={merge.y} r={8} fill="white" stroke="#212529" strokeWidth={2} />
                    <text x={merge.x} y={merge.y - 14} textAnchor="middle" fontSize={12}>
                        {intl.formatMessage({ id: 'msg.flowOverview.nodeLabel' }, { number: merge.nodeNumber })}
                    </text>
                    <title>
                        {intl.formatMessage(
                            { id: 'msg.flowOverview.nodeTitle' },
                            { number: merge.nodeNumber, time: formatTimeOnly(toIsoTime(merge.time), true) }
                        )}
                    </title>
                </g>
            ))}

            {layout.events.map((event) => {
                const label = getEventLabel(event, intl.formatMessage);
                const eventX = event.kind === 'break' ? event.x + (event.endX - event.x) / 2 : event.x;
                const icon = event.kind === 'break' ? breakIcon : arrowRightIcon;
                return (
                    <g key={event.id} data-testid={`flow-overview-${event.kind}`}>
                        {event.kind === 'break' && (
                            <line
                                x1={event.x}
                                x2={event.endX}
                                y1={event.y}
                                y2={event.y}
                                stroke={event.color}
                                strokeWidth={4}
                                strokeOpacity={0.2}
                            />
                        )}
                        <image href={icon} x={eventX - 10} y={event.y - 20} width={20} height={20} aria-label={label}>
                            <title>{label}</title>
                        </image>
                        {event.kind === 'break' && event.minutes !== undefined && (
                            <text x={eventX} y={event.y - 25} textAnchor="middle" fontSize={11}>
                                {`${event.minutes} min`}
                            </text>
                        )}
                    </g>
                );
            })}

            <g data-testid="flow-overview-finish">
                <circle
                    cx={layout.finish.x}
                    cy={layout.finish.y}
                    r={10}
                    fill="white"
                    stroke="#212529"
                    strokeWidth={2}
                />
                <text x={layout.finish.x + 16} y={layout.finish.y + 4} fontSize={12}>
                    {intl.formatMessage({ id: 'msg.flowOverview.finish' })}
                </text>
            </g>

            <line
                x1={layout.leftMargin}
                x2={layout.width - layout.rightMargin}
                y1={layout.axisY}
                y2={layout.axisY}
                stroke="#212529"
            />
            {layout.ticks.map((tick) => {
                const x = getX(layout, tick);
                return (
                    <g key={`tick:${tick}`}>
                        <line x1={x} x2={x} y1={layout.axisY} y2={layout.axisY + 6} stroke="#212529" />
                        <text x={x} y={layout.axisY + 22} textAnchor="middle" fontSize={11}>
                            {formatTimeOnly(toIsoTime(tick), true)}
                        </text>
                    </g>
                );
            })}
            <text
                x={(layout.width + layout.leftMargin - layout.rightMargin) / 2}
                y={layout.height - 8}
                textAnchor="middle"
                fontSize={12}
            >
                {intl.formatMessage({ id: 'msg.flowOverview.timeAxis' })}
            </text>
        </svg>
    );
}

export const FlowOverviewContent = () => {
    const intl = useIntl();
    const graph = useSelector(getFlowOverviewGraph);

    if (!graph) {
        return <div className="p-4 text-center">{intl.formatMessage({ id: 'msg.flowOverview.empty' })}</div>;
    }

    const layout = layoutFlowGraph(graph);
    return (
        <div>
            <FlowLegend layout={layout} />
            <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                <FlowGraphSvg layout={layout} />
            </div>
        </div>
    );
};
