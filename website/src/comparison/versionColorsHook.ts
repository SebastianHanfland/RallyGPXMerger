import { useGetUrlParam } from '../utils/linkUtil.ts';
import { getColorFromUuid } from '../utils/colorUtil.ts';

export function useGetVersionColors(): Record<string, string | undefined> {
    const planningIdsFromUrl = useGetUrlParam('comparison=');
    const colorsFromUrl = useGetUrlParam('colors=');
    const planningIds = planningIdsFromUrl?.split(',') ?? [];
    const colors = colorsFromUrl?.split(',') ?? [];
    if (!colorsFromUrl) {
        const colorLookup: Record<string, string | undefined> = {};
        planningIds.forEach((plannindId) => {
            colorLookup[plannindId] = getColorFromUuid(plannindId);
        });
        return colorLookup;
    }
    if (planningIds.length === 0 || planningIds.length !== colors.length) {
        alert('mismatch of colors and ids');
    }
    const colorLookup: Record<string, string | undefined> = {};
    colors.forEach((color, index) => {
        colorLookup[planningIds[index]] = color;
    });
    return colorLookup;
}
