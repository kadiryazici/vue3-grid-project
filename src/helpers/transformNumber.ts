export const transformNumber = (value: number): string => {
   // e3 = 3 adet 0
   // e6 = 6 adet 0
   // e9 = 9 adet 0
   if (value < 1e3) {
      return value.toString();
   }
   if (value < 1e6) {
      return (value / 1e3).toString() + 'K';
   }
   if (value < 1e9) {
      return (value / 1e6).toString() + 'M';
   }
   return (value / 1e9).toString() + 'B';
};
