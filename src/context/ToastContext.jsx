import { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';

const ToastContext = createContext();
const MAX_TOASTS = 3; // أقصى عدد إشعارات ظاهرة في نفس الوقت

// لازم يتحط جوه <Router> عشان لينك "View cart" يشتغل
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, { detail, actionLabel, actionTo } = {}) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, detail, actionLabel, actionTo }].slice(-MAX_TOASTS));
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer className="position-fixed p-3" style={{ bottom: 0, right: 0, zIndex: 1080 }}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            show
            autohide
            delay={3500}
            className="app-toast"
            onClose={() => removeToast(t.id)}
          >
            <Toast.Body className="d-flex align-items-center gap-3">
              <FiCheckCircle className="toast-icon" size={20} />
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="toast-text">{t.message}</div>
                {t.detail && <div className="toast-detail">{t.detail}</div>}
              </div>
              {t.actionTo && (
                <Link to={t.actionTo} onClick={() => removeToast(t.id)} className="toast-action">
                  {t.actionLabel}
                </Link>
              )}
              <button type="button" className="btn-close" aria-label="Close" onClick={() => removeToast(t.id)} />
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
