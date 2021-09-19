import dayjs from 'dayjs';

// dayjs bana ay verilerini 0 dan başlayarak veriyor
// enum da zaten 0 dan artarak çalışıyor o yüzden enum
enum Months {
   January,
   February,
   March,
   April,
   May,
   June,
   July,
   August,
   September,
   October,
   November,
   December
}

export const getMonthName = (date: string) => {
   const month = dayjs(date, 'YYYY-MM-DD').month();
   return Months[month];
};
