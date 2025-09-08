export const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return "-";
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};
