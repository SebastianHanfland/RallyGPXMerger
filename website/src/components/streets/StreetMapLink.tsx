import { useDispatch } from 'react-redux';
import { mapActions } from '../../store/map.reducer.ts';

interface Props {
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    streetName: string;
}

export function StreetMapLink({ pointFrom, pointTo, streetName }: Props) {
    const dispatch = useDispatch();
    return (
        <span
            title={`Open street segment for "${streetName}" on map`}
            style={{ cursor: 'pointer' }}
            onClick={() => {
                dispatch(
                    mapActions.setCenterPoint({
                        lat: (pointFrom.lat + pointTo.lat) / 2,
                        lng: (pointFrom.lon + pointTo.lon) / 2,
                        zoom: 16,
                    })
                );
            }}
        >
            <img src={'geo-alt-blue.svg'} className="m-1" alt="open on map" color={'blue'} style={{ color: 'blue' }} />
        </span>
    );
}
