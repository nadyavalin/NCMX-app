import styles from "../styles.module.css";

interface AllResponsiblePersonsProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  id?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  disabled?: boolean;
  className?: string;
}

export const AllResponsiblePersons: React.FC<AllResponsiblePersonsProps> = ({
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
      <option value="">...выбрать сотрудника</option>
      <option value="Максютенко А.А.">Максютенко А.А.</option>
      <option value="Максютенко М.А.">Максютенко М.А.</option>
      <option value="Погодина С.Б.">Погодина С.Б.</option>
      <option value="Семёнов К.С.">Семёнов К.С.</option>
      <option value="Курженков С.А.">Курженков С.А.</option>
      <option value="Черкасов А.С.">Черкасов А.С.</option>
      <option value="Мелентьев Д.В.">Мелентьев Д.В.</option>
      <option value="Бабыничев В.В.">Бабыничев В.В.</option>
      <option value="Крылова М.В.">Крылова М.В.</option>
      <option value="Суворов С.К.">Суворов С.К.</option>
      <option value="Андрианов С.В.">Андрианов С.В.</option>
      <option value="Нурмухамедов В.А.">Нурмухамедов В.А.</option>
      <option value="Матвеева М.А.">Матвеева М.А.</option>
      <option value="Разумнева Н.П.">Разумнева Н.П.</option>
      <option value="Егорова И.В.">Егорова И.В.</option>
      <option value="Павлов Ф.Б.">Павлов Ф.Б.</option>
      <option value="Годунов Б.В.">Годунов Б.В.</option>
      <option value="Хохлёнков Д.В.">Хохлёнков Д.В.</option>
      <option value="Плотников В.В.">Плотников В.В.</option>
    </select>
  );
};
