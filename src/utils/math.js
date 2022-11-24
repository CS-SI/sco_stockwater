export const getHighestValue = arr => {
  console.log('math', arr)
  const rateRef = arr.map(days => {
    const max = arr.reduce((acc, curr) => {
      return acc.value > curr.value ? acc : curr
    }, 0)
    return max.value
  })
  return rateRef
}
