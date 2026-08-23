import { renderHook } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { MemoryRouter } from 'react-router';
import { useGetUrlParam } from '../linkUtil.ts';

function readParam(url: string, paramName: string) {
    const wrapper = ({ children }: PropsWithChildren) => <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>;
    return renderHook(() => useGetUrlParam(paramName), { wrapper }).result.current;
}

describe('useGetUrlParam', () => {
    it('decodes encoded characters and plus signs', () => {
        expect(readParam('/?streetname=%C3%84u%C3%9Fere+Stra%C3%9Fe+%26+Weg', 'streetname')).toBe(
            'Äußere Straße & Weg'
        );
    });

    it('matches the exact parameter name', () => {
        expect(readParam('/?displayExtra=wrong&display=right', 'display')).toBe('right');
    });

    it('distinguishes empty and missing parameters', () => {
        expect(readParam('/?streetpath=', 'streetpath')).toBe('');
        expect(readParam('/', 'streetpath')).toBeUndefined();
    });
});
