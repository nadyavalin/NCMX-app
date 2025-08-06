"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../store/store";
import { fetchItems, restoreInconsistencyRequest } from "@api/route";
import { InconsistencyTable } from "@components/InconsistencyTable";
import styles from "./styles.module.css";

export const ArchiveInconsistencies = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { archivedItems, itemsLoading, itemsError } = useSelector((state: RootState) => state.num);

  useEffect(() => {
    const loadItems = async () => {
      try {
        await dispatch(fetchItems({ is_archived: true })).unwrap();
      } catch (error: unknown) {
        console.log(error);
      }
    };
    loadItems();
  }, [dispatch]);

  const handleRestore = async (num_nonconf: number) => {
    await dispatch(restoreInconsistencyRequest(num_nonconf)).unwrap();
  };

  return (
    <div className={styles.archiveBlock}>
      <InconsistencyTable
        title="Архив несоответствий по результатам внутренних аудитов СМК и внутренних технологических аудитов"
        items={archivedItems}
        isLoading={itemsLoading}
        error={itemsError}
        isArchived={true}
        onFetch={() => dispatch(fetchItems({ is_archived: true }))}
        onRestore={handleRestore}
      />
    </div>
  );
};

export default ArchiveInconsistencies;
