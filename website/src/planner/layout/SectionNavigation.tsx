import { Pagination } from 'react-bootstrap';
import { Sections } from './types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectionSection, layoutActions } from '../store/layout.reducer.ts';
import { FormattedMessage } from 'react-intl';
import { BackToStartDialog } from './BackToStartDialog.tsx';
import { useState } from 'react';
import Select from 'react-select';

const navigationSections: { section: Sections; openModal?: boolean }[] = [
    { section: 'start', openModal: true },
    { section: 'gps' },
    { section: 'settings' },
    { section: 'streets' },
    { section: 'importExport' },
];

export const SectionNavigation = () => {
    const dispatch = useDispatch();
    const selectedSection = useSelector(getSelectionSection);
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <Pagination className={'d-none d-lg-flex'}>
                {navigationSections.map((entry) => (
                    <Pagination.Item
                        key={entry.section}
                        active={entry.section === selectedSection}
                        onClick={() => (entry.openModal ? setShowModal(true) : setSelectedSection(entry.section))}
                    >
                        <FormattedMessage id={`msg.${entry.section}`} />
                    </Pagination.Item>
                ))}
            </Pagination>
            {showModal && <BackToStartDialog closeModal={() => setShowModal(false)} />}
        </>
    );
};
