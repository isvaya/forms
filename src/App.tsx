import { useState } from 'react';
import Modal from './components/Modal';
import UncontrolledForm from './components/FormUncontrolled';
import HookForm from './components/FormHook';
import { useFormStore } from './store/useFormStore';

export default function App() {
  const [modalType, setmodalType] = useState<null | 'uncontrolled' | 'hook'>(
    null
  );
  const closeModal = () => setmodalType(null);

  const submissions = useFormStore((state) => state.submissions);

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

        <h2>Submitted Data:</h2>
        <div className="cards-container">
          {submissions.map((data, idx) => (
            <div className="card" key={idx}>
              <p>
                <strong>Name:</strong> {data.name}
              </p>
              <p>
                <strong>Age:</strong> {data.age}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Gender:</strong> {data.gender}
              </p>
              <p>
                <strong>Country:</strong> {data.country}
              </p>
              {data.image && (
                <img src={data.image} alt="Uploaded" width={100} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
