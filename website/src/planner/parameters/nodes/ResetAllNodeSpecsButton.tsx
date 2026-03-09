import { useDispatch, useSelector } from 'react-redux';
import { getNodeSpecifications, nodesActions } from '../../store/nodes.reducer.ts';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { TrashIcon } from '../../../utils/icons/TrashIcon.tsx';
import { isDefined } from '../../../utils/typeUtil.ts';

export const ResetAllNodeSpecsButton = () => {
    const nodeSpecifications = useSelector(getNodeSpecifications);
    const setNodeSpecs = Object.values(nodeSpecifications ?? {}).filter(isDefined);
    const dispatch = useDispatch();
    const resetNodeSpec = () => dispatch(nodesActions.clear());
    if (setNodeSpecs.length === 0) {
        return null;
    }

    return (
        <Button className={'mx-1 rounded-2 p-0'} variant={'danger'} onClick={resetNodeSpec}>
            <span className={'mx-1'}>
                <FormattedMessage id={'msg.resetAll'} />
            </span>
            <TrashIcon white={true} />
        </Button>
    );
};
