import { Toast, ToastContainer } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getToasts, toastsActions } from '../store/toast.reducer.ts';

export const ToastWrapper = () => {
    const toasts = useSelector(getToasts);
    const dispatch = useDispatch();
    return (
        <ToastContainer className="p-3" position={'bottom-end'} style={{ zIndex: 2000 }}>
            {toasts.map((toast) => (
                <Toast bg={toast.type} key={toast.id} onClick={() => dispatch(toastsActions.closeToast(toast.id))}>
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">{toast.title}</strong>
                    </Toast.Header>
                    {toast.message && <Toast.Body>{toast.message}</Toast.Body>}
                </Toast>
            ))}
        </ToastContainer>
    );
};
