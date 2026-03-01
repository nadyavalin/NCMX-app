import React from "react";
import { NormativeDocument } from "@appTypes/types";
import { NormativeDocumentsList } from "./NDList";
import styles from "./styles.module.css";

interface NormativeDocumentsProps {
  documents: NormativeDocument[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof NormativeDocument, value: string) => void;
  disabled?: boolean;
}

export const NormativeDocuments: React.FC<NormativeDocumentsProps> = ({
  documents,
  onAdd,
  onRemove,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={styles.normativeDocuments}>
      {documents.map((doc, index) => (
        <div key={index} className={styles.documentRow}>
          <select
            value={doc.norm_doc || ""}
            onChange={(e) => onChange(index, "norm_doc", e.target.value)}
            disabled={disabled}
            className={styles.select}
          >
            <NormativeDocumentsList />
          </select>
          <input
            type="text"
            value={doc.point || ""}
            placeholder="Номер(а) пункта(ов) ISO/НД"
            onChange={(e) => onChange(index, "point", e.target.value)}
            disabled={disabled}
            className={styles.input}
          />
          {documents.length > 1 && (
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={disabled}
              className={styles.removeButton}
            >
              ×
            </button>
          )}
        </div>
      ))}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onAdd();
        }}
        className={disabled ? styles.disabledLink : styles.addLink}
      >
        Добавить НД
      </a>
    </div>
  );
};
