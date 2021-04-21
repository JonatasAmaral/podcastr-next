import { setSeconds } from "date-fns";

export function convertDurationToTimeString(duration: number) {
  const hours = Math.floor( duration / (60*60) );
  const minutes = Math.floor( duration % (60*60) / 60 );
  const segundos = duration % 60;


  const timeString = [hours, minutes, setSeconds]
    .map( unit=>String(unit).padStart(2, '0') )
    .join(':');

  return timeString;
}