import { Button } from 'react-bootstrap';
import german from '../../assets/german.svg';
import english from '../../assets/english.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getDisplayLanguage, layoutActions } from '../store/layout.reducer.ts';
import { CSSProperties } from 'react';

const languageStyle: CSSProperties = {
    position: 'fixed',
    height: '45px',
    borderRadius: '2px',
    left: 440,
    bottom: 50,
    zIndex: 10,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    cursor: 'pointer',
};

export function LanguageSelection() {
    const language = useSelector(getDisplayLanguage);
    const dispatch = useDispatch();

    return (
        <div style={languageStyle} className={'d-flex'}>
            <Button
                variant={'light'}
                className={(language === 'en' ? 'active ' : '') + 'm-0 p-0'}
                onClick={() => dispatch(layoutActions.setLanguage('en'))}
            >
                <img src={english} className="m-1" alt="english" />
            </Button>
            <Button
                variant={'light'}
                className={(language === 'de' ? 'active ' : '') + 'm-0 p-0'}
                onClick={() => dispatch(layoutActions.setLanguage('de'))}
            >
                <img src={german} className="m-1" alt="german" />
            </Button>
        </div>
    );
}
