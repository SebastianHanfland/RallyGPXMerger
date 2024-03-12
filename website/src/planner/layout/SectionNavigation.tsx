import { Pagination } from 'react-bootstrap';
import { Sections } from './types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectionSection, layoutActions } from '../store/layout.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { BackToStartDialog } from './BackToStartDialog.tsx';
import { useState } from 'react';
import Select from 'react-select';

const navigationSections: { section: Sections; openModal?: boolean }[] = [
    { section: 'menu', openModal: true },
    { section: 'gps' },
    { section: 'settings' },
    { section: 'streets' },
    { section: 'importExport' },
];

export const SectionNavigation = () => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const selectedSection = useSelector(getSelectionSection);
    const setSelectedSection = (section: Sections) => dispatch(layoutActions.selectSection(section));

    const [showModal, setShowModal] = useState(false);

    const options = navigationSections.map((entry) => ({
        label: intl.formatMessage({ id: `msg.${entry.section}` }),
        value: entry.section,
        openModal: entry.openModal,
    }));

    return (
        <>
            <div style={{ width: '150px' }} className={'d-xl-none'}>
                <Select
                    aria-label="Default select example"
                    options={options}
                    value={options.find((option) => option.value === selectedSection)}
                    onChange={(option) => {
                        if (option) {
                            option?.openModal ? setShowModal(true) : setSelectedSection(option?.value);
                        }
                    }}
                    isSearchable={false}
                />
            </div>
            <Pagination className={'d-none d-xl-flex'}>
                {navigationSections.map((entry) => (
                    <Pagination.Item
                        key={entry.section}
                        active={entry.section === selectedSection}
                        linkClassName={entry.openModal ? 'nav-menu' : undefined}
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
