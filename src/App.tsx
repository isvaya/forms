import './App.css';
import { useState } from 'react';
import Modal from './components/Modal/Modal';
import UncontrolledForm from './components/UncontrolledForm/FormUncontrolled';
import HookForm from './components/HookForm/FormHook';
import SubmissionsList from './components/SubmissionList/SubmissionsList';

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
      </div>
      <Modal isOpen={modalType !== null} onClose={closeModal}>
        {modalType === 'uncontrolled' && (
          <UncontrolledForm onClose={closeModal} />
        )}
        {modalType === 'hook' && <HookForm onClose={closeModal} />}
      </Modal>

      <div>
        <h1>Form Submissions</h1>
        <SubmissionsList />
      </div>
    </>
  );
}
