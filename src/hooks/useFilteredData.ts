// hooks/useFilteredData.ts
import { useSelector } from "react-redux";
import { RootState } from "@store/store";

export function useFilteredData<T>({
  items,
  getSearchable,
  getResponsibles,
  getNormDocs,
  numField,
}: {
  items: T[];
  getSearchable: (item: T) => (string | undefined | null)[];
  getResponsibles: (item: T) => { department?: string; person?: string }[];
  getNormDocs?: (item: T) => { norm_doc?: string; point?: string }[];
  numField: keyof T;
}) {
  const filters = useSelector((state: RootState) => state.ui.filters);

  const searchWords = filters.search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  const filtered = items.filter((item) => {
    // 1. Поиск по словам
    if (searchWords.length > 0) {
      const haystack = getSearchable(item).filter(Boolean).join(" ").toLowerCase();
      const allMatch = searchWords.every((word) => haystack.includes(word));
      if (!allMatch) return false;
    }

    // 2. ISO / НД
    const normDocs = getNormDocs ? getNormDocs(item) : [];
    if (filters.isoRequirement) {
      if (!normDocs.some((d) => d.point === filters.isoRequirement)) return false;
    }
    if (filters.regulation) {
      if (!normDocs.some((d) => d.norm_doc === filters.regulation)) return false;
    }

    // 3. Подразделение / ФИО
    const responsibles = getResponsibles(item);
    if (filters.department) {
      if (!responsibles.some((r) => r.department === filters.department)) return false;
    }
    if (filters.responsiblePerson) {
      if (!responsibles.some((r) => r.person === filters.responsiblePerson)) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((a, b) => Number(a[numField]) - Number(b[numField]));

  return sorted;
}
