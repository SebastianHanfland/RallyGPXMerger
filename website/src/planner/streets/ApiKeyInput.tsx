import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { geoCodingActions, getGeoApifyKey, getBigDataCloudKey } from '../store/geoCoding.reducer.ts';

export const ApiKeyInput = () => {
    const geoApifyKey = useSelector(getGeoApifyKey);
    const positionStackKey = useSelector(getBigDataCloudKey);
    const dispatch = useDispatch();

    return (
        <div className={'m-2 p-2'} style={{ height: '300px' }}>
            <h4>API Keys</h4>
            <Form.Group>
                <Form.Label>
                    <a
                        href={'https://myprojects.geoapify.com/register'}
                        target={'_blank'}
                        referrerPolicy={'no-referrer'}
                    >
                        geoapify API Key
                    </a>
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="geoapify API Key"
                    value={geoApifyKey}
                    onChange={(value) => dispatch(geoCodingActions.setGeoApifyKey(value.target.value))}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>
                    <a
                        href={'https://www.bigdatacloud.com/reverse-geocoding'}
                        target={'_blank'}
                        referrerPolicy={'no-referrer'}
                    >
                        BigDataCloud API Key
                    </a>
                </Form.Label>
                <Form.Control
                    type="text"
                    placeholder="BigDataCloud API Key"
                    value={positionStackKey}
                    onChange={(value) => dispatch(geoCodingActions.setBigDataCloudKey(value.target.value))}
                />
            </Form.Group>
        </div>
    );
};
