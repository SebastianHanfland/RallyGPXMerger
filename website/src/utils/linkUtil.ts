import { useLocation } from 'react-router';

export function useGetUrlParam(paramName: string): string | undefined {
    const { search } = useLocation();
    return new URLSearchParams(search).get(paramName) ?? undefined;
}

export function getBaseUrl() {
    return window.location.origin + window.location.pathname;
}
