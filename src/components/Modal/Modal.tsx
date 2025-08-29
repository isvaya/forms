import { useState } from 'react';
import type { YearData } from '../../types/types';
import './Modal.css';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (columns: (keyof YearData)[]) => void;
  availableColumns: (keyof YearData)[];
};

export function ColumnSelectorModal({
  isOpen,
  onClose,
  onSave,
  availableColumns,
}: ModalProps) {
  const [selected, setSelected] = useState<(keyof YearData)[]>([]);

  if (!isOpen) return null;

  const toggleColumn = (col: keyof YearData) => {
    setSelected((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="modal-container">
      <div className="modal">
        <h3>Select additional columns</h3>
        <div>
          {availableColumns.map((col) => (
            <label key={col} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={selected.includes(col)}
                onChange={() => toggleColumn(col)}
              />
              {col}
            </label>
          ))}
        </div>
        <div className="modal-button-container">
          <button onClick={() => onSave(selected)}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
