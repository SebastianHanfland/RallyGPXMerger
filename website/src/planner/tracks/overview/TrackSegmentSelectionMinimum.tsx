import { TrackComposition } from '../../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';

import { ReactSortable } from 'react-sortablejs';
import { AppDispatch } from '../../store/planningStore.ts';
import { isDefined } from '../../../utils/typeUtil.ts';
import { getColor } from '../../../utils/colorUtil.ts';

interface Props {
    track: TrackComposition;
    hideSelect?: boolean;
    fullGpxDelete?: boolean;
}

export function TrackSegmentSelectionMinimum({ track }: Props) {
    const { id, segments } = track;
    const dispatch: AppDispatch = useDispatch();

    const setSegmentIds = (items: { id: string }[]) => {
        const mappedIds = items.map((item) => item.id).join();
        if (mappedIds !== segments.map((segment) => segment.id).join()) {
            const newSegments = items.map((segmentOption) =>
                segments.find((trackElement) => trackElement.id === segmentOption.id)
            );
            dispatch(trackMergeActions.setSegments({ id, segments: newSegments.filter(isDefined) }));
        }
    };

    return (
        <div>
            <ReactSortable
                delayOnTouchOnly={true}
                list={segments.map((segment) => ({ id: segment.id }))}
                setList={setSegmentIds}
            >
                {segments.map((trackElement) => {
                    return (
                        <div
                            className={'rounded-2 d-flex justify-content-between'}
                            style={{
                                border: '1px solid transparent',
                                borderColor: 'black',
                                cursor: 'pointer',
                                margin: '1px',
                                backgroundColor: getColor(trackElement),
                            }}
                            key={trackElement.id}
                        >
                            {'Hi'}
                        </div>
                    );
                })}
            </ReactSortable>
        </div>
    );
}
