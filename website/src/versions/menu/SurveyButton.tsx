import heart from '../../assets/heart.svg';

export const SurveyButton = () => {
    return (
        <a
            href={'https://forms.gle/EQTzKx51KFuRerYT7'}
            target={'_blank'}
            referrerPolicy={'no-referrer'}
            className={'btn mx-1'}
            title={'Unterstütze uns als Ordner:in'}
        >
            {'Hilf mit! '}
            <img src={heart} className={'m-1'} alt="heart" />
        </a>
    );
};
