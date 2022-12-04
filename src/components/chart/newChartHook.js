import { AppConfig } from './../../config/index'
import { useSelector, useDispatch } from 'react-redux'
import { DataTypes, DurationTypes, ObservationTypes } from '../../config'
import { useEffect, useState, useCallback, useRef } from 'react'
import { handleResetZoom } from '../../stores/chartSlice'
import {
  getChartStartDateCurrentMonth,
  getChartFirstDateNextMonth
} from '../../utils/date'
import {
  handleDataSetsBooleanOption,
  handleDataSetsBorderWidthOption,
  handleObsType,
  handleObsTypeYearMode
} from '../../utils/chart'
import {
  addLakeLoaded,
  resetLakeLoaded
} from '../../stores/chartDataLoadedSlice'
import { isEqual } from '../../utils/data'
import chartDataLoadedSlice from '../../stores/chartDataLoadedSlice'
import OBSERVATION_TYPES from '../../config/ObservationTypes'

export default function useChartHook() {
  const [chartData, setChartData] = useState([])
  const [dataSets, setDataSets] = useState([])
  const [dateMin, setDateMin] = useState()
  const [dateMax, setDateMax] = useState()
  const [datesOfYear, setDatesOfYear] = useState({})
  const [scales, setScales] = useState()
  const [options, setOptions] = useState()
  const [obs, setObs] = useState({
    types: [],
    depth: ''
  })

  const [formOptions, setFormOptions] = useState({
    dataType: '',
    obsDepth: '',
    mode: '',
    obstypes: []
  })

  const [lastFormOptions, setLastFormOptions] = useState({
    lastDataType: '',
    lastObsDepth: '',
    lastMode: '',
    lastObstypes: []
  })

  const [isSame, setIsSame] = useState({
    dataType: '',
    obsDepth: ''
  })

  const form = useSelector(state => state.form)
  const chart = useSelector(state => state.chart)
  const { lakesChartOptions } = useSelector(state => state)
  const { yearsChartOptions } = useSelector(state => state)
  const { zoomReset } = chart
  const {
    dataType,
    OPTIC,
    RADAR,
    DAY,
    PERIOD,
    REFERENCE,
    YEAR,
    VOLUME,
    charType
  } = form

  const { label, unit } = AppConfig.attributes[dataType]
  const { active, indexToRemoveFromChartData } = useSelector(
    state => state.stateLake
  )
  const { information } = useSelector(state => state)
  const { data, mode } = useSelector(state => state.data)
  const { lakesLoaded } = useSelector(state => state.chartDataLoaded)

  const chartRef = useRef()
  const dispatch = useDispatch()

  useEffect(() => {
    if (OPTIC) {
      if (obs.types.includes(ObservationTypes.OPTIC)) return
      setObs(obs => ({
        depth: obs.depth,
        types: [...obs.types, ObservationTypes.OPTIC].sort()
      }))
    }
    if (!OPTIC) {
      if (!obs.types.includes(ObservationTypes.OPTIC)) return
      setObs(obs => ({
        depth: obs.depth,
        types: obs.types.filter(el => el !== ObservationTypes.OPTIC)
      }))
    }
  }, [OPTIC])

  useEffect(() => {
    if (RADAR) {
      if (obs.types.includes(ObservationTypes.RADAR)) return
      setObs(obs => ({
        depth: obs.depth,
        types: [...obs.types, ObservationTypes.RADAR].sort()
      }))
    }
    if (!RADAR) {
      if (!obs.types.includes(ObservationTypes.RADAR)) return
      setObs(obs => ({
        depth: obs.depth,
        types: obs.types.filter(el => el !== ObservationTypes.RADAR)
      }))
    }
  }, [RADAR])

  useEffect(() => {
    if (REFERENCE) {
      if (obs.types.includes(ObservationTypes.REFERENCE)) return
      setObs(obs => ({
        depth: obs.depth,
        types: [...obs.types, ObservationTypes.REFERENCE].sort()
      }))
    }
    if (!REFERENCE) {
      if (!obs.types.includes(ObservationTypes.REFERENCE)) return
      setObs(obs => ({
        depth: obs.depth,
        types: obs.types.filter(el => el !== ObservationTypes.REFERENCE)
      }))
    }
  }, [REFERENCE])

  useEffect(() => {
    if (!OPTIC && !RADAR && !REFERENCE) {
      setObs(obs => ({
        depth: obs.depth,
        types: []
      }))
      setChartData([])
    }
  }, [!OPTIC, !RADAR, !REFERENCE])

  useEffect(() => {
    if (DAY) {
      setObs(obs => ({
        types: [...obs.types],
        depth: DurationTypes.DAY
      }))
    }
    if (PERIOD) {
      setObs(obs => ({
        types: [...obs.types],
        depth: DurationTypes.PERIOD
      }))
    }
  }, [DAY, PERIOD])

  useEffect(() => {
    if (YEAR && chartData.length > 1) {
      setChartData([])
    }
  }, [YEAR, chartData.length])

  useEffect(() => {
    if (active.length === 0) {
      setChartData([])
      setDataSets([])
    }
  }, [active.length])

  useEffect(() => {
    if (obs.depth === lastFormOptions.lastObsDepth) {
      setIsSame(el => ({
        dataType: el.dataType,
        obsDepth: true
      }))
    }
  }, [obs.depth, lastFormOptions.lastObsDepth])

  useEffect(() => {
    if (dataType === lastFormOptions.lastDataType) {
      setIsSame(el => ({
        obsDepth: el.obsDepth,
        dataType: true
      }))
    }
  }, [dataType, lastFormOptions.lastDataType])

  useEffect(() => {
    if (!lastFormOptions.lastMode) return
    if (
      formOptions.dataType !== lastFormOptions.lastDataType ||
      formOptions.obs.depth !== lastFormOptions.lastObsDepth
    ) {
      setIsReset(true)
      dispatch(resetLakeLoaded())
    }
  }, [
    obs.depth,
    dataType,
    lastFormOptions.lastDataType,
    lastFormOptions.lastObsDepth
  ])

  useEffect(() => {
    if (!formOptions.mode) return
    setLastFormOptions({
      ...formOptions
    })
    setFormOptions(opt => ({
      mode: opt.mode,
      dataType: opt.dataType,
      obsDepth: obs.depth,
      obstypes: obs.types
    }))
  }, [obs])

  useEffect(() => {
    if (
      lastFormOptions.lastObstypes !== formOptions.obstypes ||
      lastFormOptions.lastObsDepth !== formOptions.obsDepth ||
      dataType !== lastFormOptions.lastDataType
    ) {
      setChartData([])
      setDataSets([])
      dispatch(resetLakeLoaded())
    }
  }, [
    lastFormOptions.lastObsDepth,
    lastFormOptions.lastObstypes,
    lastFormOptions.lastDataType,
    formOptions.obsDepth,
    formOptions.obstypes,
    dataType
  ])

  useEffect(() => {
    if (zoomReset) {
      chartRef.current.resetZoom()
      dispatch(handleResetZoom({ zoom: false }))
    }
  }, [zoomReset])

  useEffect(() => {
    if (indexToRemoveFromChartData) {
      const newChartData = [...chartData]
      newChartData.splice(indexToRemoveFromChartData, 1)
      setChartData(newChartData)
    }
  }, [indexToRemoveFromChartData])

  useEffect(() => {
    if ((YEAR || VOLUME) && !data[active.at(-1)][dataType]) return
    if (!obs.depth && lakesLoaded?.[active.at(-1)]?.[dataType][obs.depth])
      return
    if (!data[active.at(-1)]?.[dataType]?.[obs.depth]?.raw) return
    let dataTmp = []

    for (const id of active) {
      const dataRaw = data[id]?.[dataType]?.[obs.depth]?.raw
      if (!dataRaw) return
      if (
        (lakesLoaded?.[id]?.[dataType]?.[obs.depth] &&
          lastFormOptions.lastObstypes === obs.types) ||
        lastFormOptions.lastObsDepth === obs.depth ||
        dataType === lastFormOptions.lastDataType
      )
        continue
      const dataActualized = handleObsType(dataRaw, OPTIC, RADAR, REFERENCE)
      dataTmp.push(dataActualized)
      dispatch(addLakeLoaded({ id, dataType, obsDepth: obs.depth }))
    }
    if (
      chartData.length === 0 ||
      lastFormOptions.lastObstypes !== obs.types ||
      lastFormOptions.lastObsDepth !== obs.depth ||
      dataType !== formOptions.dataType
    ) {
      setChartData(dataTmp)
    } else {
      setChartData([...chartData, ...dataTmp])
    }
    if (
      obs.depth !== formOptions.obsDepth ||
      dataType !== formOptions.dataType ||
      obs.types !== formOptions.obstypes
    ) {
      setLastFormOptions({
        ...formOptions
      })
      setFormOptions({
        mode: 'normal',
        dataType,
        obsDepth: obs.depth,
        obstypes: obs.types
      })
    }
  }, [active, data, obs.depth, obs.types, dataType, YEAR])

  useEffect(() => {
    if (!VOLUME || YEAR) return
    const dataVolume = mode.volume.raw
    const dataVolumeActualized = handleObsType(
      dataVolume,
      OPTIC,
      RADAR,
      REFERENCE
    )

    setChartData([dataVolumeActualized])
    if (
      obs.depth !== formOptions.obsDepth ||
      dataType !== formOptions.dataType ||
      obs.types !== formOptions.obstypes
    ) {
      setLastFormOptions({
        ...formOptions
      })
      setFormOptions({
        mode: 'volume',
        dataType,
        obsDepth: obs.depth,
        obstypes: obs.types
      })
    }
  }, [VOLUME, mode, obs.depth, obs.types, dataType])

  useEffect(() => {
    if (
      active.length > 0 &&
      data[active.at(-1)]?.[dataType]?.[obs.depth]?.year
    ) {
      if (YEAR) {
        const dataYear = Object.values(
          data[active.at(-1)][dataType][obs.depth].year
        )
        const dataYearActualized = handleObsTypeYearMode(
          dataYear,
          OPTIC,
          RADAR,
          REFERENCE
        )

        setChartData(dataYearActualized)
        if (
          obs.depth !== formOptions.obsDepth ||
          dataType !== formOptions.dataType ||
          obs.types !== formOptions.obstypes
        ) {
          setLastFormOptions({
            ...formOptions
          })
          setFormOptions({
            mode: 'year',
            dataType,
            obsDepth: obs.depth,
            obstypes: obs.types
          })
        }
      }
    }
  }, [YEAR, data, obs.depth, obs.types, dataType])

  const setDataLines = useCallback(
    (item, obsType, index, lakeName, indexColor) => {
      if (!item) return
      const { borderWidth } = chart.style.default
      let { tension, pointRadius } = AppConfig.attributes[dataType]
      let backgroundColor
      let borderColor
      let pointBackgroundColor

      if (['OPTIC', 'RADAR', 'REFERENCE'].includes(obsType)) {
        backgroundColor =
          chart[dataType].style[obsType][indexColor].pointBackgroundColor
        borderColor = chart[dataType].style[obsType][indexColor].borderColor
        pointBackgroundColor =
          chart[dataType].style[obsType][indexColor].pointBackgroundColor
      }
      if (charType === 'LINE') {
        pointRadius = 0
      }
      let xAxisID
      if (YEAR) {
        xAxisID = `x${index}`
      }
      if (YEAR && obsType === 'OPTIC') {
        backgroundColor = chart.YEAR.style[xAxisID].OPTIC.backgroundColor
        borderColor = chart.YEAR.style[xAxisID].OPTIC.borderColor
        pointBackgroundColor =
          chart.YEAR.style[xAxisID].OPTIC.pointBackgroundColor
      }
      if (YEAR && obsType === 'RADAR') {
        backgroundColor = chart.YEAR.style[xAxisID].RADAR.backgroundColor
        borderColor = chart.YEAR.style[xAxisID].RADAR.borderColor
        pointBackgroundColor =
          chart.YEAR.style[xAxisID].RADAR.pointBackgroundColor
      }
      if (YEAR && obsType === 'REFERENCE') {
        backgroundColor = chart.YEAR.style[xAxisID].REFERENCE.backgroundColor
        borderColor = chart.YEAR.style[xAxisID].REFERENCE.borderColor
        pointBackgroundColor =
          chart.YEAR.style[xAxisID].REFERENCE.pointBackgroundColor
      }

      if (!YEAR) {
        xAxisID = 'x'
      }
      const isHidden = () => {
        if (VOLUME && lakeName !== undefined) {
          return true
        }
        if (VOLUME && lakeName === undefined) {
          return false
        }
        if (!YEAR && !VOLUME) {
          return !Object.values(lakesChartOptions)[indexColor]?.visible
        }
        if (YEAR && !VOLUME) {
          return !Object.values(yearsChartOptions)[indexColor].visible
        }
      }
      return {
        backgroundColor,
        borderColor,
        pointBackgroundColor,
        borderWidth,
        data: item,
        index,
        label: `${obsType}`,
        lakeName: `${lakeName}`,
        pointRadius,
        tension,
        xAxisID,
        hidden: isHidden()
      }
    },
    [
      chart,
      charType,
      dataType,
      obs.types,
      unit,
      YEAR,
      lakesChartOptions,
      yearsChartOptions
    ]
  )
  const makesScalesForyear = useCallback((isDisplay, startDate, endDate) => {
    const obj = {
      type: 'time',
      parsing: false,
      display: isDisplay,
      min: startDate,
      max: endDate,
      time: {
        displayFormats: {
          month: 'MMM yyyy',
          day: 'dd MMM'
        },
        tooltipFormat: 'dd MMM yyyy'
      }
    }
    return obj
  }, [])

  useEffect(() => {
    if (Object.entries(datesOfYear).length === 0) return
    const scalesYearsTmp = {}
    Object.entries(datesOfYear).forEach((year, index) => {
      const yearScales = makesScalesForyear(
        index === 0 ? true : false,
        getChartStartDateCurrentMonth(year[1].start),
        getChartFirstDateNextMonth(year[1].end)
      )
      scalesYearsTmp[`x${index}`] = yearScales
    })

    const y = { beginAtZero: true }
    scalesYearsTmp.y = y
    setScales(scalesYearsTmp)
  }, [datesOfYear])

  useEffect(() => {
    if (!YEAR) {
      setScales({
        x: {
          type: 'time',
          min: dateMin,
          max: dateMax,
          parsing: false,
          time: {
            displayFormats: {
              month: 'MMM yyyy',
              day: 'dd MMM'
            },
            tooltipFormat: 'dd MMM yyyy'
          }
        },
        y: {
          beginAtZero: true
        }
      })
    }
  }, [dateMin, dateMax])

  useEffect(() => {
    if (active.length === 0) return
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'nearest'
      },
      plugins: {
        title: {
          display: true,
          text: `${label}  (${unit})`,
          position: 'top',
          font: {
            size: 16
          },
          padding: {
            top: 10,
            bottom: 10
          }
        },
        tooltip: {
          callbacks: {
            title(context) {
              const { label } = context[0]
              return label
            },
            afterTitle(context) {
              if (VOLUME) return
              const { lakeName } = context[0].dataset
              return `${lakeName}`
            },
            beforeBody(context) {
              const { label } = context[0].dataset
              return `Observation: ${label}`
            },
            label(context) {
              const { formattedValue } = context
              if (!VOLUME) {
                return ` ${label}: ${formattedValue} ${unit}`
              }
              if (VOLUME) {
                return ` Total ${label}: ${formattedValue} ${unit}`
              }
            },
            afterLabel(context) {
              if (!VOLUME) return
              if (VOLUME) {
                const { date } = context.raw
                const { index } = context.dataset
                const allValue = active.map(id => {
                  return data[id]?.[DataTypes.VOLUME]?.[obs.depth].full[index]
                    .filter(item => item.date === date)
                    .map(item => item.value)
                })
                const allActiveLakesName = active.map(id => {
                  return information.information[id].name
                })
                return allValue.map((val, index) => {
                  const name = allActiveLakesName[index]
                  const value = val[0].toFixed(3)
                  return ` ${name}: ${value} ${unit}`
                })
              }
            }
          }
        },
        legend: {
          display: false
          // position: "top",
          // labels: { font: { size: 14 } },
        },
        zoom: {
          pan: {
            enabled: true,
            modifierKey: 'ctrl'
            // onPanStart: chart => {
            //   chart.event.changedPointers[0].target.style.cursor = "grab"
            // },
          },
          zoom: {
            wheel: {
              enabled: true
            },
            drag: {
              enabled: true,
              backgroundColor: 'rgba(0,204,255,0.15)',
              borderColor: 'rgba(0,204,255,1.00)',
              borderWidth: 1
            },
            pinch: {
              enabled: true
            },
            mode: 'xy'
          },
          limits: {
            y: { min: 0, max: 'original' },
            x: { min: 'original', max: 'original' }
          }
        }
      },
      scales,
      y: {
        beginAtZero: true
      },
      parsing: {
        xAxisKey: 'date',
        yAxisKey: 'value'
      },
      animation: false
    }
    setOptions(chartOptions)
  }, [scales, label, unit, VOLUME, data, active])

  useEffect(() => {
    if (!lakesChartOptions[active.at(-1)]) return
    if (YEAR || dataSets.length !== active.length * obs.types.length) return
    const activeLakes = active.map(id => {
      return lakesChartOptions[id]
    })

    const toggleChartVisibilty = handleDataSetsBooleanOption(
      dataSets,
      activeLakes,
      'visible',
      'hidden',
      obs.types.length
    )
    setDataSets(toggleChartVisibilty)
  }, [lakesChartOptions])

  useEffect(() => {
    if (!lakesChartOptions[active.at(-1)]) return
    if (YEAR || dataSets.length !== active.length * obs.types.length) return

    const activeLakes = active.map(id => {
      return lakesChartOptions[id]
    })
    const toggleBoldGraph = handleDataSetsBorderWidthOption(
      dataSets,
      activeLakes,
      'selected',
      'borderWidth',
      obs.types.length,
      chart
    )
    setDataSets(toggleBoldGraph)
  }, [lakesChartOptions])

  useEffect(() => {
    if (!data[active.at(-1)] || !YEAR || dataSets.length === 0) return
    if (
      !YEAR ||
      dataSets.length !==
        Object.values(yearsChartOptions).length *
          data[active.at(-1)][dataType][obs.depth].year[
            Object.keys(yearsChartOptions)[0]
          ].length
    )
      return
    const dataLength =
      data[active.at(-1)][dataType][obs.depth].year[
        Object.keys(yearsChartOptions)[0]
      ].length
    const activeYears = Object.values(yearsChartOptions)
    const toggleYearChartVisibilty = handleDataSetsBooleanOption(
      dataSets,
      activeYears,
      'visible',
      'hidden',
      dataLength
    )
    setDataSets(toggleYearChartVisibilty)
  }, [yearsChartOptions, data, dataType, obs.depth])

  useEffect(() => {
    if (!data[active.at(-1)] || !YEAR || dataSets.length === 0) return
    if (
      !YEAR ||
      dataSets.length !==
        Object.values(yearsChartOptions).length *
          data[active.at(-1)]?.[dataType][obs.depth]?.year[
            Object.keys(yearsChartOptions)[0]
          ].length
    )
      return
    const dataLength =
      data[active.at(-1)][dataType][obs.depth].year[
        Object.keys(yearsChartOptions)[0]
      ].length
    const activeYears = Object.values(yearsChartOptions)
    const toggleYearBoldGraph = handleDataSetsBorderWidthOption(
      dataSets,
      activeYears,
      'selected',
      'borderWidth',
      dataLength,
      chart
    )
    setDataSets(toggleYearBoldGraph)
  }, [yearsChartOptions])

  useEffect(() => {
    if (chartData.length === 0 || YEAR) return

    const arrTmp = []
    const allDates = []
    let allDatesSorted = []

    chartData?.forEach((key, index) => {
      key?.forEach(item => {
        item?.forEach((itm, idx) => {
          const data = setDataLines(
            itm,
            obs.types[idx],
            idx,
            VOLUME
              ? active.map(id => information.information[id].name)[index - 1]
              : active.map(id => information.information[id].name)[index],
            index
          )
          const itemDates = itm?.map(el => el.date)
          if (itemDates) allDates.push(...itemDates)
          arrTmp.push(data)
        })
      })
    })

    allDatesSorted = allDates.sort((a, b) => new Date(a) - new Date(b))
    const firstDateGraph = getChartStartDateCurrentMonth(allDatesSorted[0])
    setDateMin(firstDateGraph)
    const lastDateGraph = getChartFirstDateNextMonth(allDatesSorted.at(-1))
    setDateMax(lastDateGraph)

    setDataSets(arrTmp)
  }, [chartData, charType])

  useEffect(() => {
    if (!YEAR) return
    const arr = []
    if (Object.keys(yearsChartOptions).length === chartData[0]?.length) {
      const arrDate = []
      chartData.forEach(year => {
        Object.values(year).forEach((obs, index) => {
          obs.forEach((itm, idx) => {
            const data = setDataLines(
              itm[0],
              formOptions.obstypes[idx],
              index,
              information.information[active.at(-1)].name,
              index
            )
            const dateBegin = itm[0][0].date
            const dateEnd = itm[0].at(-1).date
            arrDate.push(dateBegin, dateEnd)
            arr.push(data)
          })
        })
      })
      const years = arrDate.map(date => new Date(date).getFullYear())

      const normalizeDateSorted = arrDate
        .map(el => el.replace(/\d{4}/, '2022'))
        .sort((a, b) => new Date(a) - new Date(b))

      const obj = {}
      const objAllDatesByYear = () => {
        years.map(year => {
          return (obj[year] = {
            start: normalizeDateSorted[0].replace(/\d{4}/, year),
            end: normalizeDateSorted.at(-1).replace(/\d{4}/, year)
          })
        })
      }
      objAllDatesByYear()

      setDatesOfYear(obj)
      setDataSets(arr)
    }
  }, [YEAR, chartData, charType])

  const dataChart = {
    datasets: dataSets
  }

  return {
    dataChart,
    options,
    form,
    charType,
    chartRef
  }
}
