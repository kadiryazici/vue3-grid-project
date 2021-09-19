interface RandomOptions {
   ceil?: boolean;
   floor?: boolean;
   round?: boolean;
}

/**
 * Only one option should be true and the order is:\
 * `Ceil -> Floor -> Round`
 */
export const randomBetween = (min: number, max: number, options?: RandomOptions) => {
   const num = Math.random() * (1 + max - min) + min;
   if (options) {
      const { ceil, floor, round } = options;
      if (ceil) return Math.ceil(num);
      if (floor) return Math.floor(num);
      if (round) return Math.round(num);
   }
   return num;
};
