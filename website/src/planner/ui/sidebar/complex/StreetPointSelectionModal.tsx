import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal, Table } from 'react-bootstrap';
import { RoutePointReference } from '../../../logic/resolving/streets/streetRangeEditing.ts';
import { getStreetLookupIndex } from '../../../logic/resolving/helper/getStreetLookupIndex.ts';
import { useDispatch } from 'react-redux';
import { mapActions } from '../../../store/map.reducer.ts';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon.tsx';

interface Props {
    boundary: 'start' | 'end';
    points: RoutePointReference[];
    selectablePointIndexes: Set<number>;
    streetLookup: Record<number, string | undefined>;
    onSelect: (pointIndex: number) => void;
    onClose: () => void;
}

export const StreetPointSelectionModal = ({
    boundary,
    points,
    selectablePointIndexes,
    streetLookup,
    onSelect,
    onClose,
}: Props) => {
    const dispatch = useDispatch();
    const intl = useIntl();
    const titleId = boundary === 'start' ? 'msg.selectStreetStart' : 'msg.selectStreetEnd';

    return (
        <Modal show={true} onHide={onClose} size={'lg'}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <FormattedMessage id={titleId} />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table size={'sm'} striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <FormattedMessage id={'msg.latitude'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.longitude'} />
                            </th>
                            <th>
                                <FormattedMessage id={'msg.street'} />
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {points.map(({ point, pointIndex }, routeIndex) => {
                            const streetName = streetLookup[getStreetLookupIndex(point)];
                            return (
                                <tr key={`${routeIndex}-${pointIndex}`}>
                                    <td>{routeIndex + 1}</td>
                                    <td>{point.b.toFixed(6)}</td>
                                    <td>{point.l.toFixed(6)}</td>
                                    <td>{streetName ?? intl.formatMessage({ id: 'msg.unknown' })}</td>
                                    <td className={'text-end'}>
                                        <Button
                                            type={'button'}
                                            variant={'link'}
                                            size={'sm'}
                                            title={intl.formatMessage({ id: 'msg.goToPoint' })}
                                            aria-label={intl.formatMessage({ id: 'msg.goToPoint' })}
                                            onClick={() =>
                                                dispatch(mapActions.setPointToCenter({ lat: point.b, lng: point.l }))
                                            }
                                        >
                                            <GeoLinkIcon />
                                        </Button>
                                        <Button
                                            type={'button'}
                                            size={'sm'}
                                            disabled={!selectablePointIndexes.has(routeIndex)}
                                            onClick={() => onSelect(routeIndex)}
                                        >
                                            <FormattedMessage id={'msg.selectPoint'} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};
