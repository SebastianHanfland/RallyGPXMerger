import { useGetUrlParam } from '../../utils/linkUtil';

export function useTimesConfig(): 'off' | 'defaultOff' | 'defaultOn' {
    const timesParam = useGetUrlParam('times');
    if (timesParam === 'off') {
        return 'off';
    } else if (timesParam === 'defaultOff') {
        return 'defaultOff';
    }

    return 'defaultOn';
}
