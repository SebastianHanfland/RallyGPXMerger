import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GapPointDisplay } from './GapPointDisplay.tsx';
import { getPoints } from '../store/points.reducer.ts';
import { getGaps } from '../calculation/getGaps.ts';
import { PointOfInterestDisplay } from './PointOfInterestDisplay.tsx';
import { FormattedMessage } from 'react-intl';

export function PointsOfInterest() {
    const pointOfInterests = useSelector(getPoints) ?? [];
    const gapPoints = useSelector(getGaps) ?? [];

    return (
        <div style={{ height: '95%', overflow: 'auto' }}>
            <h4>
                <FormattedMessage id={'msg.gaps'} />
            </h4>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.title'} />
                        </th>
                        <th style={{ width: '70%', minWidth: '150px' }}>
                            <FormattedMessage id={'msg.description'} />
                        </th>
                        <th style={{ width: '10%', minWidth: '100px' }}>
                            <FormattedMessage id={'msg.actions'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {gapPoints.map((gapPoint) => (
                        <GapPointDisplay key={gapPoint.id} gapPoint={gapPoint} />
                    ))}
                </tbody>
            </Table>
            <h4>
                <FormattedMessage id={'msg.pointsOfInterest'} />
            </h4>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>
                            <FormattedMessage id={'msg.title'} />
                        </th>
                        <th style={{ width: '70%', minWidth: '150px' }}>
                            <FormattedMessage id={'msg.description'} />
                        </th>
                        <th style={{ width: '10%', minWidth: '100px' }}>
                            <FormattedMessage id={'msg.actions'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pointOfInterests.map((poi) => (
                        <PointOfInterestDisplay key={poi.id} pointOfInterest={poi} />
                    ))}
                </tbody>
            </Table>
        </div>
    );
}
