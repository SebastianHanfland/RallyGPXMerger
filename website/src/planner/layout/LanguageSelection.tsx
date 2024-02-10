import { Button } from 'react-bootstrap';
import german from '../../assets/german.svg';
import english from '../../assets/english.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getDisplayLanguage, layoutActions } from '../store/layout.reducer.ts';

export function LanguageSelection() {
    const language = useSelector(getDisplayLanguage);
    const dispatch = useDispatch();

    return (
        <>
            <Button
                variant="light"
                className={language === 'en' ? 'active' : undefined}
                title="Delete all GPX segments, track compositions and tracks"
                onClick={() => dispatch(layoutActions.setLanguage('en'))}
            >
                <img src={english} className="m-1" alt="english" />
            </Button>
            <Button
                variant="light"
                className={language === 'de' ? 'active' : undefined}
                title="Delete all GPX segments, track compositions and tracks"
                onClick={() => dispatch(layoutActions.setLanguage('de'))}
            >
                <img src={german} className="m-1" alt="german" />
            </Button>
        </>
    );
}
