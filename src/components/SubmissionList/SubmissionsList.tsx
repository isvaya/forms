import './SubmissionsList.css';
import { useFormStore } from '../../store/useFormStore';

export default function SubmissionsList() {
  const submissions = useFormStore((s) => s.submissions);
  const highlightedId = useFormStore((s) => s.highlightedId);

  if (submissions.length === 0) {
    return <p>No submissions yet.</p>;
  }

  return (
    <div className="submissions">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className={`card ${highlightedId === sub.id ? 'highlight' : ''}`}
        >
          <h3>{sub.name}</h3>
          <p>
            <strong>Age:</strong> {sub.age}
          </p>
          <p>
            <strong>Email:</strong> {sub.email}
          </p>
          <p>
            <strong>Gender:</strong> {sub.gender}
          </p>
          <p>
            <strong>Country:</strong> {sub.country}
          </p>
          {sub.image && (
            <img
              src={sub.image}
              alt={sub.name}
              style={{ maxWidth: '100px', marginTop: '8px' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
