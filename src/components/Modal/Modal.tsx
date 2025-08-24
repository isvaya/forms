import './Modal.css';
import ReactDOM from 'react-dom';
import type { PropsWithChildren } from 'react';
import { useEffect, useRef } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const firstInput = modalRef.current?.querySelector<HTMLInputElement>(
      'input, select, textarea'
    );
    firstInput?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content" ref={modalRef}>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close modal"
        >
          &#x2715;
        </button>
        {children}
      </div>
      <div className="modal-overlay" onClick={onClose} />
    </div>,
    document.body
  );
};

export default Modal;
