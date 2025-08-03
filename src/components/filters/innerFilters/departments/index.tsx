import styles from "../../styles.module.css";

export const InnerDepartmentsFilter = () => {
  return (
    <select className={styles.filter}>
      <option value="НПО">НПО</option>
      <option value="ОКТП НПО">ОКТП НПО</option>
      <option value="ОПиД НПО">ОПиД НПО</option>
      <option value="Тех. дир НПО">Тех. дир НПО</option>
      <option value="ПП ФЭИС">ПП ФЭИС</option>
      <option value="ПП СОК">ПП СОК</option>
      <option value="НПГС">НПГС</option>
      <option value="ОПиД НПГС">НПГС</option>
      <option value="ОТП НПГС">ОТП НПГС</option>
      <option value="Тех. дир НПГС">Тех. дир НПГС</option>
      <option value="ППГС">ППГС</option>
      <option value="СС">СС</option>
      <option value="СЛиВЭД">СЛиВЭД</option>
      <option value="СМиП">СМиП</option>
      <option value="ИТС">ИТС</option>
      <option value="IT">IT</option>
      <option value="СОР">СОР</option>
      <option value="A10">ФС</option>
      <option value="A11">КС</option>
      <option value="A12">все подразделения</option>
      <option value="A13">все менеджеры проектов</option>
    </select>
  );
};
