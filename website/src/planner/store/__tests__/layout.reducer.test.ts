import { createPlanningStore } from '../planningStore';
import { getIsShareModalOpen, layoutActions } from '../layout.reducer';

describe('Layout reducer', () => {
    it('should control the share modal state while remaining absent in old states', () => {
        const store = createPlanningStore();

        expect(getIsShareModalOpen(store.getState())).toBeUndefined();

        store.dispatch(layoutActions.setIsShareModalOpen(true));
        expect(getIsShareModalOpen(store.getState())).toBe(true);

        store.dispatch(layoutActions.setIsShareModalOpen(false));
        expect(getIsShareModalOpen(store.getState())).toBe(false);
    });
});
