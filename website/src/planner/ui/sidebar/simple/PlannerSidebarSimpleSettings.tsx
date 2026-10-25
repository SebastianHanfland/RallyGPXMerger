import { ApiKeyInput } from '../../../streets/ApiKeyInput.tsx';
import { ResetAllResolvedStreets } from '../../../segments/ResetAllResolvedStreets.tsx';

export const PlannerSidebarSimpleSettings = () => {
    return (
        <div>
            <ApiKeyInput />
            <ResetAllResolvedStreets />
        </div>
    );
};
