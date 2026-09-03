import { Dropdown } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { UploadDataButton } from '../server/UploadDataButton.tsx';
import { PasswordButton } from '../server/PasswordButton.tsx';
import { RemoveUploadedDataButton } from '../server/RemoveUploadedDataButton.tsx';
import { SharePlanningButton } from '../sharing/SharePlanningButton.tsx';
import { CloudIcon } from '../../utils/icons/CloudIcon.tsx';

export const PlannerCloudActions = ({ onMap = false }: { onMap?: boolean }) => {
    const intl = useIntl();
    return (
        <Dropdown className="m-1" drop={onMap ? 'down' : undefined}>
            <Dropdown.Toggle
                variant="success"
                title={intl.formatMessage({ id: 'msg.cloudActions' })}
                style={onMap ? { width: '45px', height: '45px', padding: 0 } : undefined}
            >
                <CloudIcon />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Header>
                    <FormattedMessage id="msg.cloudSaving" />
                </Dropdown.Header>
                <Dropdown.Item as="div">
                    <UploadDataButton />
                </Dropdown.Item>
                <Dropdown.Item as="div">
                    <PasswordButton />
                </Dropdown.Item>
                <Dropdown.Item as="div">
                    <SharePlanningButton />
                </Dropdown.Item>
                <Dropdown.Item as="div">
                    <RemoveUploadedDataButton />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
