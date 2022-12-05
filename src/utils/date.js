export const extractDataByYear = data => {
  if (!data) return []
  const dataByYear = {}
  data
    .map(item => {
      return {
        date: new Date(item.date),
        value: item.value,
      }
    })
    .map(item => {
      const year = item.date.getFullYear()
      if (!dataByYear[year]) {
        dataByYear[year] = []
      }
      const date = `${item.date.getFullYear()}-${
        item.date.getMonth() + 1 < 10
          ? `0${item.date.getMonth() + 1}`
          : item.date.getMonth() + 1
      }-${
        item.date.getDate() < 10
          ? `0${item.date.getDate()}`
          : item.date.getDate()
      }`
      dataByYear[year].push({
        date,
        value: item.value,
      })
    })

  return dataByYear
}
export const groupDataByYear = data => {
  const dataByYear = {}
  const yearsArray = Object.keys(data[0])
  yearsArray.forEach(year => {
    dataByYear[year] = []
  })
  Object.entries(data).forEach(([, obsType]) => {
    Object.entries(obsType).forEach((obs, index) => {
      const [year, value] = obs
      if (year === yearsArray[index]) {
        dataByYear[year].push([value])
      }
    })
  })
  return dataByYear
}

export const getDataByYear = arr => {
  const dataTmp = []
  arr.forEach(el => {
    const dataYear = []
    el.forEach(data => {
      dataYear.push(extractDataByYear(data))
    })
    const dataByYear = groupDataByYear(dataYear)

    dataTmp.push(dataByYear)
  })
  return dataTmp
}

const getStartDate = arr => {
  const firstDate = arr[0]
    .filter(el => el?.length > 0)
    ?.map(el => {
      return el[0]?.date
    })
    .filter(el => el !== undefined)
    .sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1))
  return firstDate
}

const getLastDate = arr => {
  const lastDate = arr[0]
    .filter(el => el?.length > 0)
    ?.map(el => {
      return el.at(-1)?.date
    })
    .filter(el => el !== undefined)
    .sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1))[0]
  return lastDate
}

export const getFirstDateOfArrays = arr => {
  if (!arr[0]) return
  const dateTmp = []
  const firstDate01 = arr[0]
    .map(el => el.date)
    .sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1))[0]
  const firstDate02 = arr[1]
    ?.map(el => el.date)
    .sort((a, b) => (new Date(a) < new Date(b) ? -1 : 1))[0]
  dateTmp.push(firstDate01, firstDate02)
  dateTmp.sort((a, b) => (a < b ? -1 : 1))
  return dateTmp[0]
}
export const getLastDateOfArrays = arr => {
  if (!arr[0]) return
  const dateTmp = []
  const lastDate01 = arr[0]
    .map(el => el.date)
    .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))[0]
  const lastDate02 = arr[1]
    ?.map(el => el.date)
    .sort((a, b) => (new Date(a) > new Date(b) ? -1 : 1))[0]
  dateTmp.push(lastDate01, lastDate02)
  dateTmp.sort((a, b) => (a < b ? -1 : 1))
  return dateTmp.at(-1)
}

export const fillEmptyDataOfDate = arr => {
  const arrOfDates = []
  const newData = []
  const startingDate = getStartDate(arr)
  const endingDate = new Date(getLastDate(arr))
  for (
    let d = new Date(startingDate[0]);
    d <= endingDate;
    d.setDate(d.getDate() + 1)
  ) {
    arrOfDates.push(new Date(d).toISOString().slice(0, 10))
  }
  let value = ''
  let arrTmp = []
  const obsTypes = arr[0]?.map(obs => obs)
  const obsTypesDateFiltered = obsTypes.map(obs => {
    if (obs.length === 0) return []
    return obs?.filter(el => {
      return (
        el.date >= new Date(startingDate[0]).toISOString().slice(0, 10) &&
        el.date <= endingDate.toISOString().slice(0, 10)
      )
    })
  })
  obsTypesDateFiltered.forEach(obs => {
    if (obs.length === 0) return []
    arrOfDates.forEach(date => {
      if (obs?.map(el => el.date).includes(date)) {
        value = obs.filter(el => el.date === date).map(el => el.value)[0]
      }
      arrTmp.push({
        date,
        value,
      })
    })
    newData.push(
      arrTmp.filter(el => {
        return (
          el.date >= new Date(startingDate.at(-1)).toISOString().slice(0, 10) &&
          el.date <= endingDate.toISOString().slice(0, 10)
        )
      })
    )
    arrTmp = []
  })
  return [newData]
}
export const getChartStartDateCurrentMonth = date => {
  const minDatevalue = new Date(date)
  const firstDayMonth = new Date(
    minDatevalue.getFullYear(),
    minDatevalue.getMonth(),
    1
  )
  return firstDayMonth
}

export const getChartFirstDateNextMonth = date => {
  const maxDateValue = new Date(date)
  const nextMonth = new Date(
    maxDateValue.getFullYear(),
    maxDateValue.getMonth() + 1,
    1
  )
  return nextMonth
}
