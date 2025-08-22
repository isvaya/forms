import ReactDOM from 'react-dom';
import type { PropsWithChildren } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({
  isOpen,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &#x2715;
        </button>
        {children}
      </div>
      <div className="modal-overlay" onClick={onClose}></div>
    </div>,
    document.body
  );
};

export default Modal;
