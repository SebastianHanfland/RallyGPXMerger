import { Col, Row, Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { StreetMapLink } from '../streets/StreetMapLink.tsx';
import { useSelector } from 'react-redux';
import { getPoints } from '../store/points.reducer.ts';

export const PointsOverview = () => {
    const points = useSelector(getPoints);
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
                                <th>
                                    <FormattedMessage id={'msg.radius'} />
                                </th>
                                <th>
                                    <FormattedMessage id={'msg.type'} />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {points.map((point) => (
                                <tr key={point.id}>
                                    <td>
                                        {point.title}
                                        <StreetMapLink
                                            pointFrom={{ lat: point.lat, lon: point.lng }}
                                            pointTo={{ lat: point.lat, lon: point.lng }}
                                        />
                                    </td>
                                    <td>{point.description}</td>
                                    <td>{point.radiusInM}</td>
                                    <td>{point.type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};
