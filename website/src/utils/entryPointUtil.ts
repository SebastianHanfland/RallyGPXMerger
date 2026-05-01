import { getLanguage } from '../language.ts';
import { formatTimeOnly, roundPublishedStartTimes } from './dateUtil.ts';
import { EntryPointPosition } from '../planner/logic/resolving/selectors/getEntryPointPositions.ts';

export function getEntryPointTime(entryPoint: EntryPointPosition): string {
    return formatTimeOnly(
        roundPublishedStartTimes(entryPoint.at, entryPoint.buffer ?? 0, entryPoint.rounding ?? 0),
        true
    );
}

export function getEntryPointTooltip(entryPoint: EntryPointPosition) {
    return (
        entryPoint.streetName +
        (getLanguage() === 'de' ? ' um ' : ' at ') +
        getEntryPointTime(entryPoint) +
        `${entryPoint.extraInfo ? '. ' + entryPoint.extraInfo : ''}`
    );
}
