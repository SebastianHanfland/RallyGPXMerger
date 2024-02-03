import check from '../../../assets/check-circle.svg';

export function Done() {
    return <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />;
}
