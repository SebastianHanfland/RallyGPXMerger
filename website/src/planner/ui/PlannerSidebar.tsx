import { CSSProperties } from 'react';
import { FormattedMessage } from 'react-intl';
import { PlannerSidebarContent } from './PlannerSidebarContent.tsx';
import { PlannerSidebarNavigation } from './PlannerSidebarNavigation.tsx';
import { PlannerSidebarSimpleContent } from './PlannerSidebarSimpleContent.tsx';
import { PlannerSidebarSimpleNavigation } from './PlannerSidebarSimpleNavigation.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getHasSingleTrack, getIsSidebarOpen, layoutActions } from '../store/layout.reducer.ts';
import { ClosePlannerSidebar } from './ClosePlannerSidebar.tsx';
import PocketBase from 'pocketbase';

const getStyle = (showSidebar: boolean): CSSProperties => ({
    position: 'fixed',
    width: `${showSidebar ? '50vw' : '30px'}`,
    height: '100vh',
    right: 0,
    top: 0,
    zIndex: 10,
    backgroundColor: 'white',
    overflowX: 'hidden',
    overflowY: 'scroll',
    cursor: showSidebar ? undefined : 'pointer',
});

function ComplexContent() {
    return (
        <div>
            <PlannerSidebarNavigation />
            <PlannerSidebarContent />
        </div>
    );
}

function SimpleContent() {
    return (
        <div>
            <PlannerSidebarSimpleNavigation />
            <PlannerSidebarSimpleContent />
        </div>
    );
}

function Content() {
    const hasSingleTrack = useSelector(getHasSingleTrack);
    return hasSingleTrack ? <SimpleContent /> : <ComplexContent />;
}
const pb = new PocketBase('http://127.0.0.1:8090');

export function PlannerSidebar() {
    const showSidebar = useSelector(getIsSidebarOpen);
    const dispatch = useDispatch();
    // const [password, setPassword] = useState('');

    const id = 'abcabcabcabcabc';
    const pw = 'pw';

    const hash = (a: string, seed: string) => a;

    const saveData = () => {
        pb.collection('planning')
            .create({ id, data: { a: 'a' } })
            .then((planning) => {
                pb.collection('permissions').create({
                    planning_id: planning.id,
                    password_hash: hash(pw, planning.id),
                });
            });
    };
    const updateData = () => {
        pb.collection('planning').update(id, { data: { b: 'b' }, password_hash: hash(pw, id) });
    };
    const deleteData = () => {
        pb.collection('planning').delete(id, { password_hash: hash(pw, id) });
    };
    const getData = () => {
        pb.collection('planning').getOne(id);
    };
    return (
        <>
            <ClosePlannerSidebar />

            <div
                style={getStyle(showSidebar)}
                className={'shadow'}
                onClick={() => dispatch(layoutActions.setIsSidebarOpen(true))}
                title={showSidebar ? undefined : 'See overview'}
            >
                <button onClick={saveData}>Save</button>
                <button onClick={updateData}>update</button>
                <button onClick={deleteData}>delete</button>
                <button onClick={getData}>get</button>
                {showSidebar ? (
                    <div className={'mb-5'} style={{ height: '100vh' }}>
                        <Content />
                    </div>
                ) : (
                    <span style={{ writingMode: 'vertical-lr' }} className={'my-3'}>
                        <FormattedMessage id={'msg.dashboard'} />
                    </span>
                )}
            </div>
        </>
    );
}
