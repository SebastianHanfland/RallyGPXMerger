import bikeHeart from '../../assets/bikeHeart.svg';

export const SurveyButton = () => {
    return (
        <a
            href={'https://forms.gle/EQTzKx51KFuRerYT7'}
            target={'_blank'}
            referrerPolicy={'no-referrer'}
            className={'btn mx-3'}
            title={'Unterstütze uns als Ordner:in'}
        >
            {'Hilf mit! '}
            <img src={bikeHeart} className={'m-1'} alt="heart" style={{ width: '35px', height: '35px' }} />
        </a>
    );
};
