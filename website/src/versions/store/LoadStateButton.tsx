import { storedState } from '../data/loadJsonFile.ts';
import { Button } from 'react-bootstrap';
import { storage } from '../../planner/store/storage.ts';

export const canEdit = window.location.search.includes('&edit');
export const showTimes = window.location.search.includes('&showTimes');

export const LoadStateButton = () => {
    if (!storedState) {
        return null;
    }
    if (!canEdit) {
        return null;
    }

    const loadJsonIntoPlanner = () => {
        if (storedState) {
            storage.save(storedState);
            window.location.reload();
            const { origin, pathname } = window.location;
            window.location.href = origin + pathname;
        }
    };

    return <Button onClick={loadJsonIntoPlanner}>Load into editor</Button>;
};
