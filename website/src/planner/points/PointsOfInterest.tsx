import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { getPoints } from '../store/points.reducer.ts';
import { PointOfInterestDisplay } from './PointOfInterestDisplay.tsx';
import { FormattedMessage } from 'react-intl';
import { GpxCreationHint } from '../segments/GpxCreationHint.tsx';
import { DescriptionInfoButton } from '../ui/sidebar/DescriptionInfoButton.tsx';

export function PointsOfInterest() {
    const pointOfInterests = useSelector(getPoints) ?? [];

    return (
        <div style={{ height: '95%', overflow: 'auto' }}>
            <div className={'d-flex align-items-center justify-content-center mb-3'}>
                <h4>
                    <FormattedMessage id={'msg.pointsOfInterest'} />
                </h4>
                <DescriptionInfoButton
                    titleMessageId={'msg.pointsOfInterest'}
                    descriptionMessageId={'msg.pointsOfInterest.hint'}
                >
                    <GpxCreationHint />
                </DescriptionInfoButton>
            </div>
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
