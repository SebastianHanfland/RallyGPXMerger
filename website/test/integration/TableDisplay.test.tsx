import { render, screen } from '@testing-library/react';

export const CCom = () => {
    return <div>Dummy</div>;
};


describe('dummy render test', () => {
    it('should find a node', () => {
        // given
        render(<CCom></CCom>);

        screen.getByText('Dummy')
    });
});
