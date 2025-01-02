import styles from "./styles.module.css";

export const Improvements = () => {
  return (
    <>
      <main>
        <h3>
          Реестр возможностей для улучшения по результатам внутренних аудитов СМК и внутренних
          технологических аудитов
        </h3>
        <section className={styles.filterSection}>
          <select>
            <option value="orderNumber">фильтр по порядковому номеру</option>
            <option value="requirements">фильтр по требованиям НД</option>
            <option value="requirements">фильтр по подразделению</option>
            <option value="responsibleForObservation">фильтр по ответственному лицу</option>
          </select>

          <select>
            <option value="">порядковые номера из базы</option>
            <option value="">НД из базы</option>
            <option value="">аббревиатура подразделения из базы</option>
            <option value="">ФИО из базы</option>
          </select>

          <input type="text" placeholder="Поиск..." />

          <button>Получить данные</button>
        </section>

        <section className="improvementsTableSection">
          <table className="improvementsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>№</th>
                <th>Ссылки на пункты ISO 9001 / 80079-34 / НД</th>
                <th>Описание возможности для улучшения</th>
                <th>Источник информации о несоответствии</th>
                <th>Ответственный за реализацию</th>
                <th>Срок реализации</th>
                <th>Действия с возможностью для улучшения</th>
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
                <td>
                  <div className={styles.observationActions}>
                    <a href="#">Добавить комментарий</a>
                    <a href="#">Посмотреть историю комментариев к возможности для улучшения</a>
                    <a href="#">
                      Провести оценку результативности для закрытия возможности для улучшения
                    </a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={styles.addButton}>
          <button>Добавить возможность для улучшения</button>
        </section>
      </main>
    </>
  );
};
