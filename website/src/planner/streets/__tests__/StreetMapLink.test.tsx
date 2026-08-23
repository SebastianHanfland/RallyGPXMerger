import { render, screen } from '@testing-library/react';
import { decodeStreetPath } from '../../../utils/streetPathUrl.ts';
import { StreetMapLink } from '../StreetMapLink.tsx';

describe('StreetMapLink', () => {
    it('opens the full street geometry in the standalone map', () => {
        const path = [
            { lat: 48, lon: 11 },
            { lat: 48.1, lon: 11.1 },
            { lat: 48.2, lon: 11.2 },
        ];

        render(<StreetMapLink path={path} streetName="Main Street" />);

        const link = screen.getByTitle('Open street segment on map');
        const url = new URL(link.getAttribute('href')!);
        expect(url.searchParams.get('streetname')).toBe('Main Street');
        expect(decodeStreetPath(url.searchParams.get('streetpath')!)).toEqual(path);
        expect(link).toHaveAttribute('target', '_blank');
    });
});
