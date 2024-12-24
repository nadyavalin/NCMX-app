import styles from "./styles.module.css";

export const Inconsistencies = () => {
  return (
    <>
      <main>
        <h3>
          Реестр несоответствий по результатам внутренних аудитов СМК и внутренних технологических
          аудитов
        </h3>
        <section className={styles.filterSection}>
          <select>
            <option value="orderNumber">фильтр по порядковому номеру</option>
            <option value="requirements">фильтр по требованиям НД</option>
            <option value="requirements">фильтр по подразделению</option>
            <option value="responsibleForCorrection">
              фильтр по ответственному лицу за коррекцию
            </option>
            <option value="responsibleForCorrectiveAction">
              фильтр по ответственному лицу за кор.действие
            </option>
          </select>

          <select>
            <option value="">порядковые номера из базы</option>
            <option value="">НД из базы</option>
            <option value="">аббревиатура подразделения из базы</option>
            <option value="">ФИО из базы</option>
            <option value="">ФИО из базы</option>
          </select>

          <input type="text" placeholder="Поиск..." />

          <button>Получить данные</button>
        </section>

        <section className="inconsistenciesTableSection">
          <table className="inconsistenciesTable">
            <thead>
              <tr>
                <th rowSpan={2}>ID</th>
                <th rowSpan={2}>№</th>
                <th rowSpan={2}>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th rowSpan={2}>Описание несоответствия</th>
                <th rowSpan={2}>Источник информации о несоответствии</th>
                <th colSpan={3}>Анализ причин несоответствия</th>
                <th colSpan={3}>Коррекции</th>
                <th colSpan={3}>Корректирующие действия</th>
                <th rowSpan={2}>Действия с несоответствием</th>
              </tr>
              <tr>
                <th>Дата проведения анализа</th>
                <th>Состав группы, проводившей анализ</th>
                <th>Причины несоответствия, определенные по результатам анализа</th>
                <th>Описание коррекции</th>
                <th>Дата внедрения</th>
                <th>Ответственное лицо</th>
                <th>Описание корректирующего действия</th>
                <th>Дата внедрения</th>
                <th>Ответственное лицо</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>...</td>
                <td>
                  <div className={styles.inconsistenciesActions}>
                    <a href="#">Добавить комментарий</a>
                    <a href="#">Посмотреть историю комментариев к несоответствию</a>
                    <a href="#">Провести оценку результативности для закрытия несоответствия</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.addButton}>
          <button>Добавить несоответствие</button>
        </section>
      </main>
    </>
  );
};
