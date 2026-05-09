import { useGetUrlParam } from '../../utils/linkUtil.ts';

export function useTableIndices(): number[] | undefined {
    const tableIndices = useGetUrlParam('rows=');
    if (!tableIndices) {
        return undefined;
    }
    const tableIndicesToShow = tableIndices
        .split(',')
        .map((index) => Number(index))
        .filter((num) => !isNaN(num));

    if (tableIndicesToShow.length === 0) {
        return undefined;
    }
    return tableIndicesToShow;
}
