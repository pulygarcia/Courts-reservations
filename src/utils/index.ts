import { parseISO, format } from "date-fns";
import { es } from "date-fns/locale";

export const weekDays = [
  {value: '1', day: 'Lunes'},
  {value: '2', day: 'Martes'},
  {value: '3', day: 'Miercoles'},
  {value: '4', day: 'Jueves'},
  {value: '5', day: 'Viernes'},
  {value: '6', day: 'Sabado'},
  {value: '0', day: 'Domingo'}
]

export const parseEmailDate = (date:string) => {
  const reservationDate = parseISO(date); //convert to date
  const dateFormatted = format(reservationDate, "EEEE dd/MM/yyyy", {locale: es});

  return dateFormatted
}