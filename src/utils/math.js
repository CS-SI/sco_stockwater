export const getHighestValue = arr => {
  const arrfilter = arr.map(day => day.value)
  return Math.max.apply(null, arrfilter)
}
