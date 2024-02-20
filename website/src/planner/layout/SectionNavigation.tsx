import { Pagination } from 'react-bootstrap';
import { Sections } from './types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectionSection, layoutActions } from '../store/layout.reducer.ts';
import { FormattedMessage } from 'react-intl';
import { BackToStartDialog } from './BackToStartDialog.tsx';
import { useState } from 'react';

export const SectionNavigation = () => {
    const dispatch = useDispatch();
    const selectedSection = useSelector(getSelectionSection);
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Pagination>
                <Pagination.Item key={'start'} onClick={() => setShowModal(true)}>
                    <FormattedMessage id={'msg.start'} />
                </Pagination.Item>
                <Pagination.Item
                    key={'gps'}
                    active={'gps' === selectedSection}
                    onClick={() => setSelectedSection('gps')}
                >
                    <FormattedMessage id={'msg.planner'} />
                </Pagination.Item>
                <Pagination.Item
                    key={'settings'}
                    active={'settings' === selectedSection}
                    onClick={() => setSelectedSection('settings')}
                >
                    <FormattedMessage id={'msg.settings'} />
                </Pagination.Item>
                <Pagination.Item
                    key={'streets'}
                    active={'streets' === selectedSection}
                    onClick={() => setSelectedSection('streets')}
                >
                    <FormattedMessage id={'msg.streets'} />
                </Pagination.Item>
                <Pagination.Item
                    key={'importExport'}
                    active={'importExport' === selectedSection}
                    onClick={() => setSelectedSection('importExport')}
                >
                    <FormattedMessage id={'msg.importExport'} />
                </Pagination.Item>
            </Pagination>
            {showModal && <BackToStartDialog closeModal={() => setShowModal(false)} />}
        </>
    );
};
