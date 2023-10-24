import { useDispatch } from 'react-redux';
import { Button } from 'react-bootstrap';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

interface Props {
    id: string;
    name: string;
}

export function RemoveFileButton({ id, name }: Props) {
    const dispatch = useDispatch();
    return (
        <Button
            variant="danger"
            title={`Remove file "${name}" and all references`}
            className={'m-1'}
            onClick={() => {
                dispatch(gpxSegmentsActions.removeGpxSegment(id));
                dispatch(trackMergeActions.removeGpxSegment(id));
            }}
        >
            x
        </Button>
    );
}
