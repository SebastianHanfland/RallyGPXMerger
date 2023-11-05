import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { geoCodingActions, getGeoApifyKey, getBigDataCloudKey } from '../../store/geoCoding.reducer.ts';

export const ApiKeyInput = () => {
    const geoApifyKey = useSelector(getGeoApifyKey);
    const positionStackKey = useSelector(getBigDataCloudKey);
    const dispatch = useDispatch();

    return (
        <div>
            <Form.Group>
                <Form.Label>geoapify API Key</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="geoapify API Key"
                    value={geoApifyKey}
                    onChange={(value) => dispatch(geoCodingActions.setGeoApifyKey(value.target.value))}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>BigDataCloud API Key</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="BigDataCloud API Key"
                    value={positionStackKey}
                    onChange={(value) => dispatch(geoCodingActions.setBigDataCloudKeyKey(value.target.value))}
                />
            </Form.Group>
        </div>
    );
};
