import { Col, Form, Row, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { listAllNodesOfTracks } from '../logic/merge/helper/nodeFinder.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import { ReactSortable } from 'react-sortablejs';
import { useState } from 'react';

export const NodePointsOverview = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackNodes = listAllNodesOfTracks(tracks);
    const gpxSegments = useSelector(getGpxSegments);
    const nodePositions = useSelector(getNodePositions);

    const getGpxSegment = (segmentId: string) => gpxSegments.find((segment) => segment.id === segmentId);
    const getTrackComposition = (trackId: string) => tracks.find((track) => track.id === trackId);

    const [list, setList] = useState(['A', 'B', 'C']);

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
                            {nodePositions.map((trackNode) => (
                                <tr key={JSON.stringify(trackNode.point)}>
                                    <td>{JSON.stringify(trackNode.point)}</td>
                                    <td style={{ wordBreak: 'break-all', whiteSpace: 'nowrap' }}>
                                        {trackNode.tracks.join(',')}
                                    </td>
                                    <td style={{ wordBreak: 'break-all', whiteSpace: 'nowrap' }}>
                                        {JSON.stringify(trackNode)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
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
                            {['A', 'B'].map((trackNode) => (
                                <tr key={JSON.stringify(trackNode)}>
                                    <td>{trackNode}</td>
                                    <td>
                                        <Form.Range min={0} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <ReactSortable
                        delayOnTouchOnly={true}
                        list={list.map((segmentId) => ({ id: segmentId }))}
                        setList={(newList) => setList(newList.map(({ id }) => id))}
                    >
                        {list.map((segmentId) => {
                            return (
                                <div className={'m-1'} title={segmentId} style={{ backgroundColor: 'blue' }}>
                                    {segmentId}
                                </div>
                            );
                        })}
                    </ReactSortable>
                </Col>
            </Row>
        </div>
    );
};
