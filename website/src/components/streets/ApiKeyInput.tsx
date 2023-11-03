import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    geoCodingActions,
    getGeoApifyKey,
    getLocationIqKey,
    getPositionStackKey,
} from '../../store/geoCoding.reducer.ts';

export const ApiKeyInput = () => {
    const geoApifyKey = useSelector(getGeoApifyKey);
    const locationIqKey = useSelector(getLocationIqKey);
    const positionStackKey = useSelector(getPositionStackKey);
    const dispatch = useDispatch();

    return (
        <div>
            <Form.Group>
                <Form.Label>geoApifyKey</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="geoApifyKey"
                    value={geoApifyKey}
                    onChange={(value) => dispatch(geoCodingActions.setGeoApifyKey(value.target.value))}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>locationIqKey</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="locationIqKey"
                    value={locationIqKey}
                    onChange={(value) => dispatch(geoCodingActions.setLocationIqKey(value.target.value))}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>positionStackKey</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="positionStackKey"
                    value={positionStackKey}
                    onChange={(value) => dispatch(geoCodingActions.setPositionStackKey(value.target.value))}
                />
            </Form.Group>
        </div>
    );
};
