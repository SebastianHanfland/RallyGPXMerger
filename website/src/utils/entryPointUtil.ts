import { getLanguage } from '../language';
import { formatTimeOnly } from './dateUtil';
import { EntryPointPosition } from '../planner/logic/resolving/selectors/getEntryPointPositions';

export function getEntryPointTime(entryPoint: EntryPointPosition): string {
    return formatTimeOnly(entryPoint.at, true);
}

export function getEntryPointTooltip(entryPoint: EntryPointPosition) {
    return (
        entryPoint.streetName +
        (getLanguage() === 'de' ? ' um ' : ' at ') +
        getEntryPointTime(entryPoint) +
        `${entryPoint.extraInfo ? '. ' + entryPoint.extraInfo : ''}`
    );
}
