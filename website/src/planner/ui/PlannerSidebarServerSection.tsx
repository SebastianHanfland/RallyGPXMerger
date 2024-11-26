import { UploadDataButton } from '../layout/UploadDataButton.tsx';
import { RemoveUploadedDataButton } from '../layout/RemoveUploadedDataButton.tsx';
import { PasswordButton } from '../layout/PasswordButton.tsx';
import { SharePlanningButton } from '../layout/SharePlanningButton.tsx';
import { CleanDataButton } from '../layout/CleanDataButton.tsx';
import { DownloadDataButton } from '../layout/DownloadDataButton.tsx';

export const PlannerSidebarServerSection = () => {
    return (
        <div>
            <UploadDataButton />
            <RemoveUploadedDataButton />
            <PasswordButton />
            <SharePlanningButton />
            <CleanDataButton />
            <DownloadDataButton />
        </div>
    );
};
