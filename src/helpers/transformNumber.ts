export const transformNumber = (value: number): string => {
   if (value < 1e3) {
      return fixNumber(value);
   }
   if (value < 1e6) {
      return fixNumber(value / 1e3) + 'K';
   }
   if (value < 1e9) {
      return fixNumber(value / 1e6) + 'M';
   }
   return fixNumber(value / 1e9) + 'B';
};

function fixNumber(num: number) {
   return num.toFixed(2).replace(/\.00$/, '');
}
