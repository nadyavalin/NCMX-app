import styles from "../styles.module.css";

export const Requirements = () => {
  return (
    <select className={styles.list}>
      <option value="">...выбрать регламент</option>
      <option value="A1">A1</option>
      <option value="A2">A2</option>
      <option value="A3">A3</option>
      <option value="A4">A4</option>
      <option value="A5.1">A5.1</option>
      <option value="A5.2">A5.2</option>
      <option value="A6.1">A6.1</option>
      <option value="A6.2">A6.2</option>
      <option value="A7">A7</option>
      <option value="A8.4">A8.4</option>
      <option value="A8.5">A8.5</option>
      <option value="A8.6">A8.6</option>
      <option value="A9">A9</option>
      <option value="A10">A10</option>
      <option value="A11">A11</option>
      <option value="A12">A12</option>
      <option value="A13">A14</option>
    </select>
  );
};
