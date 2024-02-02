import { Button } from 'react-bootstrap';
import fileUpload from '../../assets/file-up.svg';
import { useDispatch } from 'react-redux';
import { loadSampleData } from '../io/loadSampleData.ts';

export function LoadExampleDataButton() {
    const dispatch = useDispatch();

    return (
        <Button
            onClick={() => loadSampleData(dispatch)}
            title={'Load some example gpx segments and tracks. This removes other files'}
        >
            <img src={fileUpload} className="m-1" alt="open file" />
            Load sample data
        </Button>
    );
}
