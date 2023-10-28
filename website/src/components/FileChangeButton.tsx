import { Button } from 'react-bootstrap';
import exchange from '../assets/exchange.svg';
import check from '../assets/check.svg';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { useDispatch } from 'react-redux';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface Props {
    id: string;
    name: string;
}
export function FileChangeButton({ id, name }: Props) {
    const dispatch = useDispatch();
    const uploadInput = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setTimeout(() => setIsLoading(false), 2000);
        }
    }, [isLoading]);

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
                .then(() => setIsLoading(true))
                .catch(console.error);
        }
    };

    return (
        <Button
            variant={'light'}
            onClick={buttonClicked}
            title={`Change file for the segment "${name}"`}
            className={'m-1'}
        >
            <input type="file" name="file" onChange={changeHandler} ref={uploadInput} hidden={true} />
            {isLoading ? <img src={check} alt="check-mark" /> : <img src={exchange} alt="exchange" />}
        </Button>
    );
}
