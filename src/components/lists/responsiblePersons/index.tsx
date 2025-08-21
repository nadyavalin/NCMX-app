import styles from "../styles.module.css";

export const RespPersons = () => {
  return (
    <select className={styles.list}>
      <option value="">...выбрать сотрудника</option>
      <option value="Максютенко А.А.">Максютенко А.А.</option>
      <option value="Максютенко М.А.">Максютенко М.А.</option>
      <option value="Погодина С.Б.">Погодина С.Б.</option>
      <option value="Семёнов К.С.">Семёнов К.С.</option>
      <option value="Курженков С.А.">Курженков С.А.</option>
      <option value="Черкасов А.С.">Черкасов А.С.</option>
      <option value="Мелентьев Д.В.">Мелентьев Д.В.</option>
      <option value="Бабыничев В.В.">Бабыничев В.В.</option>
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
