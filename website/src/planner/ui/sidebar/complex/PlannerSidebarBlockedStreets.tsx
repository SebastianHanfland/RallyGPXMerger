import { PageItem, Pagination } from 'react-bootstrap';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { BlockedStreetsModal } from './BlockedStreetsModal.tsx';

export const PlannerSidebarBlockedStreets = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const onHide = () => setShowModal(false);
    return (
        <div className={'m-2'}>
            <Pagination style={{ flexFlow: 'wrap' }}>
                <PageItem onClick={() => setShowModal(true)}>
                    <FormattedMessage id={'msg.blockedStreets'} />
                </PageItem>
            </Pagination>
            {showModal && <BlockedStreetsModal onHide={onHide} />}
        </div>
    );
};
