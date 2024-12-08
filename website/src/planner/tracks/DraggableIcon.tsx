import dots from '../../assets/threeDots.svg';

export const DraggableIcon = () => {
    return (
        <div className={'m-1'}>
            <img src={dots} alt="dots" style={{ height: '20px', width: '20px' }} />
            <img src={dots} alt="dots" style={{ height: '20px', width: '20px', marginLeft: '-13px' }} />
        </div>
    );
};
