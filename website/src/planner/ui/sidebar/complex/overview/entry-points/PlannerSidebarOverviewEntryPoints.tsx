import { Table } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { ColorBlob } from '../../../../../../utils/ColorBlob';
import { getColor } from '../../../../../../utils/colorUtil';
import { getAllEntryPointPositions } from '../../../../../logic/resolving/selectors/getEntryPointPositions';
import { isTrackEntryPoint } from '../../../../../store/types';
import { getTrackCompositions } from '../../../../../store/trackMerge.reducer';
import { EntryPointRow } from './EntryPointRow';

export const PlannerSidebarOverviewEntryPoints = () => {
    const intl = useIntl();
    const tracks = useSelector(getTrackCompositions);
    const positions = useSelector(getAllEntryPointPositions);

    return (
        <div>
            {tracks.map((track) => {
                const entryPoints = track.segments.filter(isTrackEntryPoint);
                if (entryPoints.length === 0) {
                    return null;
                }

                return (
                    <div key={track.id} className="mb-3">
                        <div className="fw-bold mb-1">
                            <ColorBlob color={getColor(track)} />
                            {track.name || '---'}{' '}
                            <FormattedMessage id="msg.entryPointsCount" values={{ amount: entryPoints.length }} />
                        </div>
                        <Table striped bordered hover style={{ width: '100%' }} size="sm">
                            <thead>
                                <tr>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.bufferedTime" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.realTime" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.rounding" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.buffer" />
                                    </th>
                                    <th style={{ whiteSpace: 'normal' }}>
                                        <FormattedMessage id="msg.street" />
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        <span className="visually-hidden">
                                            {intl.formatMessage({ id: 'msg.actions' })}
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {entryPoints.map((entryPoint) => (
                                    <EntryPointRow
                                        key={`${track.id}-${entryPoint.id}`}
                                        track={track}
                                        entryPoint={entryPoint}
                                        position={positions.find(
                                            (position) => position.trackId === track.id && position.id === entryPoint.id
                                        )}
                                    />
                                ))}
                            </tbody>
                        </Table>
                    </div>
                );
            })}
        </div>
    );
};
