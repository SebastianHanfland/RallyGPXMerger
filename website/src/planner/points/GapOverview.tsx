import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { GapPointDisplay } from './GapPointDisplay.tsx';
import { getGaps } from '../calculation/getGaps.ts';
import { FormattedMessage } from 'react-intl';
import { GapFinderParameters } from '../parameters/GapFinderParameters.tsx';

export function GapOverview() {
    const gapPoints = useSelector(getGaps) ?? [];

    return (
        <div style={{ height: '95%', overflow: 'auto' }}>
            <GapFinderParameters />
            <h4 className={'my-4'}>
                <FormattedMessage id={'msg.gaps'} />
            </h4>

            {gapPoints.length > 0 ? (
                <Table striped bordered hover style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '70%', minWidth: '150px' }}>
                                <FormattedMessage id={'msg.description'} />
                            </th>
                            <th style={{ width: '70%', minWidth: '150px' }}>
                                <FormattedMessage id={'msg.gapSize'} />
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
            ) : (
                <FormattedMessage id={'msg.noGaps'} />
            )}
        </div>
    );
}
