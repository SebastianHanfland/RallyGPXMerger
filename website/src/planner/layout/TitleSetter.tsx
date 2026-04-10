import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPlanningTitle } from '../store/settings.reducer.ts';

export const TitleSetter = () => {
    const planningTitle = useSelector(getPlanningTitle);

    useEffect(() => {
        if (planningTitle) {
            document.title = planningTitle;
        }
    }, [planningTitle]);
    return null;
};
