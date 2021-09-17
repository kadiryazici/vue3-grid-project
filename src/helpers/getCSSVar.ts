export const getCSSVar = (name: string) => {
   return getComputedStyle(document.documentElement).getPropertyValue(name);
};
