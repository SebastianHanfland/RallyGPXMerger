import { Col, Row, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { listAllNodesOfTracks } from '../logic/merge/helper/nodeFinder.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

export const NodePointsOverview = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackNodes = listAllNodesOfTracks(tracks);
    const gpxSegments = useSelector(getGpxSegments);

    const getGpxSegment = (segmentId: string) => gpxSegments.find((segment) => segment.id === segmentId);
    const getTrackComposition = (trackId: string) => tracks.find((track) => track.id === trackId);

    return (
        <div>
            <Row>
                <h3 className={'mb-5'}>
                    <FormattedMessage id={'msg.points'} />
                </h3>
            </Row>
            <Row className="flex-xl-nowrap" style={{ height: '70vh', minHeight: '200px', width: '100%' }}>
                <Col>
                    <Table striped bordered hover style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>
                                    <FormattedMessage id={'msg.title'} />
                                </th>
                                <th style={{ width: '50%' }}>
                                    <FormattedMessage id={'msg.description'} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {trackNodes.map((trackNode) => (
                                <tr key={trackNode.segmentIdAfterNode}>
                                    <td>{getGpxSegment(trackNode.segmentIdAfterNode)?.filename}</td>
                                    <td style={{ wordBreak: 'break-all', whiteSpace: 'nowrap' }}>
                                        {trackNode.segmentsBeforeNode
                                            .map((segment) => {
                                                const trackName = getTrackComposition(segment.trackId)?.name;
                                                const segmentName = getGpxSegment(segment.segmentId)?.filename;
                                                return `${segmentName} (${trackName}, ${segment.amount} People)`;
                                            })
                                            .join('\n')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};
