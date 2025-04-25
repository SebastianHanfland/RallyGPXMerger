import { Dropdown } from 'react-bootstrap';
import scissors from '../../assets/scissors.svg';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getClickOnSegment, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { splitGpxAtPosition } from './splitSegmentThunk.ts';
import { AppDispatch } from '../store/planningStore.ts';

export const SplitSegmentDropdownItem = () => {
    const dispatch: AppDispatch = useDispatch();
    const clickOnSegment = useSelector(getClickOnSegment);
    if (!clickOnSegment) {
        return null;
    }
    return (
        <Dropdown.Item
            onClick={() => {
                dispatch(splitGpxAtPosition);
                dispatch(gpxSegmentsActions.setClickOnSegment(undefined));
            }}
        >
            <img src={scissors} alt="split segment" color={'#ffffff'} className="m-1" />
            <span>
                <FormattedMessage id={'msg.splitSegment'} />
            </span>
        </Dropdown.Item>
    );
};
