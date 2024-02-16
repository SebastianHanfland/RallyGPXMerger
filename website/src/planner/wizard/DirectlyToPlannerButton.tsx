import { useDispatch } from 'react-redux';
import { Sections } from '../layout/types.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export const DirectlyToPlannerButton = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => {
        dispatch(layoutActions.setShowDashboard(true));
        dispatch(layoutActions.selectSection(section));
    };

    return (
        <Button className={'m-4'} variant={'secondary'} onClick={() => setSelectedSection('gps')}>
            <FormattedMessage id={'msg.directToPlanner'} />
        </Button>
    );
};
