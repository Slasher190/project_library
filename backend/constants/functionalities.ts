export const calculateTotalPrice = (price: number, period: number): number => {
  return price * period;
};
export const calculateEndDate = (period: number): Date => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + period);
  return currentDate;
};
