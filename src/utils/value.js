const handleValue = (value, unit) => {
  if (unit === 'hm³') {
    return (1 * value) / 1_000_000
  }
  if (unit === 'ha') {
    return (1 * value) / 10_000
  }
}

export const formatCSVValue = (data, unit) => {
  return data.map(obs => {
    return obs[0].map((data, index) => {
      return data.map(el => {
        // index 2 = ZSV series
        if (index === 2) {
          return {
            date: el.date,
            hour: el.hour,
            volume: handleValue(el.volume, 'hm³'),
            area: handleValue(el.area, 'ha'),
          }
        } else {
          return {
            date: el.date,
            value: unit === '%' ? el.value : handleValue(el.value, unit),
          }
        }
      })
    })
  })
}

export const normalizeValue = (arr, rate) => {
  return arr.map(data => {
    return { date: data.date, value: (data.value / rate) * 100 }
  })
}

export const extractField = (arr, column) => {
  return arr.map(data => {
    return {
      date: data.date,
      value: data[column],
    }
  })
}

export const formatValue = (data, unit) => {
  if (!data) return
  const { length } = data
  return data.map(el => {
    return {
      date: el.date,
      value: unit === '%' ? el.value : handleValue(el.value, unit),
    }
  })
}
