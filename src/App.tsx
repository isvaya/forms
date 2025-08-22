import { useState } from 'react';
import Modal from './components/Modal';
import UncontrolledForm from './components/FormUncontrolled';
import HookForm from './components/FormHook';

export default function App() {
  const [modalType, setmodalType] = useState<null | 'uncontrolled' | 'hook'>(
    null
  );

  const closeModal = () => setmodalType(null);

  return (
    <>
      <div className="buttons-container">
        <button onClick={() => setmodalType('uncontrolled')}>
          Uncontrolled
        </button>
        <button onClick={() => setmodalType('hook')}>React Hook</button>
        <Modal isOpen={modalType !== null} onClose={closeModal}>
          {modalType === 'uncontrolled' && (
            <UncontrolledForm onClose={closeModal} />
          )}
          {modalType === 'hook' && <HookForm onClose={closeModal} />}
        </Modal>
      </div>
    </>
  );
}
