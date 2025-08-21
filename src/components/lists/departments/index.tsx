import React from "react";
import styles from "../styles.module.css";

interface DepartmentsProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  className?: string;
}

export const Departments: React.FC<DepartmentsProps> = ({
  name,
  id,
  value = "",
  onChange,
  disabled = false,
  className = styles.list,
  ...rest
}) => {
  return (
    <select
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      {...rest}
    >
      <option value="">...выбрать подразделение</option>
      <option value="НПО">НПО</option>
      <option value="НПГС">НПГС</option>
      <option value="ПП ФЭИС">ПП ФЭИС</option>
      <option value="ПП СОК">ПП СОК</option>
      <option value="ППГС">ППГС</option>
      <option value="ОКТП НПО">ОКТП НПО</option>
      <option value="ОПиД НПО">ОПиД НПО</option>
      <option value="ОТП НПГС">ОТП НПГС</option>
      <option value="ОПиД НПГС">ОПиД НПГС</option>
      <option value="Тех. дир НПО">Тех. дир НПО</option>
      <option value="Тех. дир НПГС">Тех. дир НПГС</option>
      <option value="СС">СС</option>
      <option value="СЛиВЭД">СЛиВЭД</option>
      <option value="СМиП">СМиП</option>
      <option value="ИТС">ИТС</option>
      <option value="IT">IT</option>
      <option value="СОР">СОР</option>
      <option value="ФС">ФС</option>
      <option value="КС">КС</option>
      <option value="все подразделения">все подразделения</option>
      <option value="все менеджеры проектов">все менеджеры проектов</option>
    </select>
  );
};
