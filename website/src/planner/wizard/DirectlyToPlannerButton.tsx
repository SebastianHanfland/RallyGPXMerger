import { useDispatch } from 'react-redux';
import { Sections } from '../layout/types.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { Button } from 'react-bootstrap';

export const DirectlyToPlannerButton = () => {
    const dispatch = useDispatch();
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    return (
        <Button className={'m-4'} variant={'secondary'} onClick={() => setSelectedSection('gps')}>
            Go Directly to the planner
        </Button>
    );
};
