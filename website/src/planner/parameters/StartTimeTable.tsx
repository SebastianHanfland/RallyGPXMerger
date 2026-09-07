import { Button, Form, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { TrackBuffer } from '../tracks/components/TrackBuffer.tsx';
import { TrackRounding } from '../tracks/components/TrackRounding.tsx';
import { getTrackStreetInfos } from '../calculation/getTrackStreetInfos.ts';
import { useState } from 'react';
import { getCount } from '../../utils/inputUtil.ts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/planningStore.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

export const StartTimeTable = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);
    const dispatch: AppDispatch = useDispatch();
    const [buffer, setBuffer] = useState<number | undefined>();
    const [rounding, setRounding] = useState<number | undefined>();

    return (
        <div>
            <div className="d-flex flex-nowrap align-items-end gap-2 mb-2" data-testid="start-time-bulk-controls">
                <Form.Group className="flex-shrink-1" style={{ minWidth: 0, flex: '1 1 0' }}>
                    <Form.Label htmlFor="set-buffer-for-all-tracks">
                        <FormattedMessage id="msg.buffer" />
                    </Form.Label>
                    <Form.Control
                        id="set-buffer-for-all-tracks"
                        type="number"
                        value={buffer ?? ''}
                        onChange={(event) => setBuffer(getCount(event))}
                    />
                </Form.Group>
                <Button
                    className="flex-shrink-1"
                    style={{
                        minWidth: 0,
                        flex: '1 1 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    variant="secondary"
                    onClick={() => dispatch(trackMergeActions.setTrackBufferForAll(buffer))}
                >
                    <FormattedMessage id="msg.setBufferForAllTracks" />
                </Button>
                <Form.Group className="flex-shrink-1" style={{ minWidth: 0, flex: '1 1 0' }}>
                    <Form.Label htmlFor="set-rounding-for-all-tracks">
                        <FormattedMessage id="msg.rounding" />
                    </Form.Label>
                    <Form.Control
                        id="set-rounding-for-all-tracks"
                        type="number"
                        value={rounding ?? ''}
                        onChange={(event) => setRounding(getCount(event))}
                    />
                </Form.Group>
                <Button
                    className="flex-shrink-1"
                    style={{
                        minWidth: 0,
                        flex: '1 1 0',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    variant="secondary"
                    onClick={() => dispatch(trackMergeActions.setTrackRoundingForAll(rounding))}
                >
                    <FormattedMessage id="msg.setRoundingForAllTracks" />
                </Button>
            </div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.start'} />
                        </th>
                        <th style={{ width: '15%' }}>
                            <FormattedMessage id={'msg.buffer'} />
                        </th>
                        <th style={{ width: '15%' }}>
                            <FormattedMessage id={'msg.rounding'} />
                        </th>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.publicStart'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tracks.map((track) => {
                        const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                        return (
                            <tr key={track.id}>
                                <td>{track.name}</td>
                                <td>
                                    {matchedTrackInfo?.startFront ? formatTimeOnly(matchedTrackInfo?.startFront) : ''}
                                </td>
                                <td>
                                    <TrackBuffer track={track} />
                                </td>
                                <td>
                                    <TrackRounding track={track} />
                                </td>
                                <td>
                                    {matchedTrackInfo?.publicStart ? formatTimeOnly(matchedTrackInfo?.publicStart) : ''}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};
