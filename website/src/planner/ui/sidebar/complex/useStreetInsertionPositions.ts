import { useLayoutEffect, useRef, useState } from 'react';

export function useStreetInsertionPositions(streetCount: number) {
    const tableRef = useRef<HTMLTableElement>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
    const [insertionPositions, setInsertionPositions] = useState<number[]>([0]);

    useLayoutEffect(() => {
        const table = tableRef.current;
        if (!table) return;

        const updatePositions = () => {
            const tableTop = table.getBoundingClientRect().top;
            const rows = rowRefs.current
                .slice(0, streetCount)
                .filter((row): row is HTMLTableRowElement => row !== null);
            if (rows.length === 0) {
                setInsertionPositions([(table.tHead?.getBoundingClientRect().bottom ?? tableTop) - tableTop]);
                return;
            }
            setInsertionPositions([
                ...rows.map((row) => row.getBoundingClientRect().top - tableTop),
                rows[rows.length - 1]!.getBoundingClientRect().bottom - tableTop,
            ]);
        };

        updatePositions();
        window.addEventListener('resize', updatePositions);
        if (typeof ResizeObserver === 'undefined') {
            return () => window.removeEventListener('resize', updatePositions);
        }
        const observer = new ResizeObserver(updatePositions);
        observer.observe(table);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updatePositions);
        };
    }, [streetCount]);

    return { tableRef, rowRefs, insertionPositions };
}
