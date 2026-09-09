import { Dropdown } from 'react-bootstrap';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface Props {
    x: number;
    y: number;
    onClose: () => void;
    children: ReactNode;
}

export function TrackSelectionContextMenu({ x: initialX, y: initialY, onClose, children }: Props) {
    const menuRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: initialX, y: initialY });

    useEffect(() => {
        const closeOnOutsideClick = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current?.contains(target)) {
                return;
            }
            if (target instanceof Element && target.closest('.modal')) {
                return;
            }
            onClose();
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('mousedown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [onClose]);

    useLayoutEffect(() => {
        if (!menuRef.current) {
            return;
        }
        const menu = menuRef.current.getBoundingClientRect();
        setPosition((current) => ({
            x: Math.max(0, Math.min(current.x, window.innerWidth - menu.width - 8)),
            y: Math.max(0, Math.min(current.y, window.innerHeight - menu.height - 8)),
        }));
    }, []);

    return (
        <Dropdown.Menu
            ref={menuRef}
            show
            style={{ position: 'fixed', left: position.x, top: position.y, zIndex: 1000001 }}
        >
            {children}
        </Dropdown.Menu>
    );
}
