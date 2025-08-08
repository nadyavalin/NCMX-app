"use client";

import "@/globals.css";
import ObservationTable from "@components/ObservationTable";

export const Observations = () => {
  return (
    <>
      <main>
        <ObservationTable title="Реестр наблюдений по результатам внутренних аудитов СМК и внутренних технологических аудитов" />
      </main>
    </>
  );
};
