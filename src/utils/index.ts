import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export const parseEmailDate = (date:string) => {
  const reservationDate = parseISO(date); //convert to date
  const dateFormatted = format(reservationDate, "EEEE dd/MM/yyyy", {locale: es});

  return dateFormatted
}