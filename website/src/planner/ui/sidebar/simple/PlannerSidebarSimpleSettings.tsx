import { ApiKeyInput } from '../../../streets/ApiKeyInput';
import { ResetAllResolvedStreets } from '../../../segments/ResetAllResolvedStreets';

export const PlannerSidebarSimpleSettings = () => {
    return (
        <div>
            <ApiKeyInput />
            <ResetAllResolvedStreets />
        </div>
    );
};
