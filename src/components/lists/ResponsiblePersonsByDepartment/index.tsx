import React from "react";
import styles from "../styles.module.css";

interface ResponsiblePersonsByDepartmentProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  className?: string;
  persons: { value: string; label: string }[];
}

export const ResponsiblePersonsByDepartment: React.FC<ResponsiblePersonsByDepartmentProps> = ({
  name,
  id,
  value = "",
  onChange,
  disabled = false,
  className = styles.list,
  persons,
  ...rest
}) => {
  return (
    <select
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled || persons.length === 0}
      className={className}
      {...rest}
    >
      <option value="">...выбрать сотрудника</option>
      {persons.map((person) => (
        <option key={person.value} value={person.value}>
          {person.label}
        </option>
      ))}
    </select>
  );
};
