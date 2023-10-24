import { Button } from 'react-bootstrap';
import exchange from '../assets/exchange.svg';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useRef } from 'react';

interface Props {
    id: string;
}
export function FileChangeButton({ id }: Props) {
    const dispatch = useDispatch();
    const uploadInput = useRef<HTMLInputElement>(null);

    const buttonClicked = () => {
        const current = uploadInput.current;
        if (current) {
            current.click();
        }
    };

    const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length === 1) {
            files[0]
                ?.text()
                .then((newContent) => dispatch(gpxSegmentsActions.changeGpxSegmentContent({ id, newContent })))
                .catch(console.error);
        }
    };

    return (
        <Button variant={'light'} onClick={buttonClicked}>
            <input type="file" name="file" onChange={changeHandler} ref={uploadInput} hidden={true} />
            <img src={exchange} className="App-logo" alt="logo" />
            Change file
        </Button>
    );
}
