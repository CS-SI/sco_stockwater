import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { addData } from './stores/dataSlice'
import { removeLake } from './stores/stateLakeSlice'
import { addColor } from './stores/chartSlice'
import { ObservationTypes, DurationTypes, DataTypes } from './config'
import { fillEmptyDataOfDate, getDataByYear } from './utils/date'
import {
  getDataFormalized,
  getDataRaw,
  getReferenceSerieDataType,
  makeFillingRateZSVdata,
} from './utils/data'
import { addLakeChartOptions } from './stores/lakesChartOptionsSlice'
import { addYearsChartOptions } from './stores/yearsChartOptionsSlice'

export function useAppHook() {
  const [isOneLakeActive, setIsOneLakeActive] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [obsDepth, setObsDepth] = useState(DurationTypes.PERIOD)
  const [lastObsDepth, setLastObsDepth] = useState(DurationTypes.PERIOD)
  const [lastDataType, setLastDataType] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [noData, setNoData] = useState(false)
  const [noDataFound, setNoDataFound] = useState([])
  const form = useSelector(state => state.form)
  const { active } = useSelector(state => state.stateLake)
  const { data, loaded } = useSelector(state => state.data)
  const { seriePath: serPath } = useSelector(state => state.information)
  const { DAY, PERIOD, YEAR, dataType } = form
  const dispatch = useDispatch()

  const handleData = useCallback(
    async lakeId => {
      if (data[lakeId]?.[dataType]?.[obsDepth]) return
      const allSeriesPath = serPath[lakeId]

      const newAllData = await getDataRaw(allSeriesPath, form).catch({})

      let dataZSV
      let newfillingRateZSV
      let volumeDataFullDates
      if (dataType === DataTypes.FILLING_RATE) {
        dataZSV = getReferenceSerieDataType(newAllData[2], DataTypes.VOLUME)
      } else {
        dataZSV = getReferenceSerieDataType(newAllData[2], dataType)
      }
      const formalizedData = getDataFormalized(dataZSV, dataType)

      if (dataType === DataTypes.FILLING_RATE) {
        newfillingRateZSV = makeFillingRateZSVdata(formalizedData)
      }
      const allData = newAllData.every(el => el.length > 0)
      const noData = newAllData.every(el => el.length === 0)
      if (noData) {
        dispatch(removeLake({ id: lakeId }))
      }

      let tmp = []
      newAllData.forEach((serie, index) => {
        if (serie.length === 0) {
          if (index === 0) {
            tmp.push('optic')
          }
          if (index === 1) {
            tmp.push('radar')
          }
          if (index === 2) {
            tmp.push('reference')
          }
        }
      })
      setNoDataFound(tmp)

      if (noData) return

      const newData = [
        getDataFormalized(newAllData[0], dataType),
        getDataFormalized(newAllData[1], dataType),
        newfillingRateZSV ? newfillingRateZSV : formalizedData,
      ]

      if (dataType === DataTypes.VOLUME) {
        volumeDataFullDates = fillEmptyDataOfDate([newData])
      }

      const obsName = obsDepth.toLowerCase()
      const obsNameByYear = `${obsName}ByYear`
      const volumeFullDates = `${obsName}Full`
      const dataByYear = getDataByYear([newData])

      let dataWB = {
        [obsName]: newData,
        [obsNameByYear]: dataByYear[0],
      }

      if (dataType === DataTypes.VOLUME) {
        dataWB = {
          ...dataWB,
          [volumeFullDates]: volumeDataFullDates[0],
        }
      }
      dispatch(
        addData({
          id: lakeId,
          dataType,
          dataWB,
          obsDepth,
          obsName,
          obsNameByYear,
          volumeFullDates,
        })
      )

      dispatch(addLakeChartOptions({ id: lakeId }))

      setLastDataType(dataType)
      setLastObsDepth(obsDepth)
    },
    [dispatch, active, dataType, obsDepth]
  )

  useEffect(() => {
    if (active.length === 0) return
    if (!YEAR || data[active.at(-1)][dataType][obsDepth].year.length === 0)
      return

    const dataYears = data[active.at(-1)][dataType][obsDepth].year
    const years = Object.keys(dataYears)
    dispatch(addYearsChartOptions({ years }))
  }, [YEAR, data, loaded])

  useEffect(() => {
    if (
      // active.length === loaded.length ||
      data[active.at(-1)]?.[dataType]?.[obsDepth]
    )
      return
    const lakeId = active.at(-1)
    if (!lakeId) return
    handleData(lakeId)
  }, [active, data, dataType])

  useEffect(() => {
    if (active.length <= 1) return
    if (dataType !== lastDataType || obsDepth !== lastObsDepth) {
      for (const lakeId of active) {
        if (data[lakeId]?.[dataType]?.[obsDepth]) return
        handleData(lakeId)
      }
    }
  }, [active, obsDepth, lastObsDepth, dataType, lastDataType, data])

  const handleCanvas = useCallback(cvas => {
    setCanvas(cvas)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  })

  useEffect(() => {
    if (DAY) {
      setObsDepth(DurationTypes.DAY)
    }
    if (PERIOD) {
      setObsDepth(DurationTypes.PERIOD)
    }
    setLastObsDepth(obsDepth)
  }, [DAY, PERIOD])

  useEffect(() => {
    if (
      active.length > 0 &&
      data[active.at(-1)]?.[dataType]?.[obsDepth]?.raw[0].length > 0
    ) {
      setIsOneLakeActive(true)
    }
    if (active.length === 0) {
      setIsOneLakeActive(false)
    }
  }, [active, data, dataType])

  const handleSetNoData = useCallback(() => {
    setNoData(false)
  }, [])

  useEffect(() => {
    if (noDataFound.length > 0) {
      setNoData(true)
    }
  }, [noDataFound])

  const addChartColor = useCallback(() => {
    const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
      Math.random() * 255
    )}, ${Math.floor(Math.random() * 255)}, 1)`
    dispatch(
      addColor({
        dataType,
        obsType: ObservationTypes.OPTIC,
        color: randomColor,
      })
    )
    let newColor = randomColor.replace(/,[^,]+$/, ',0.66)')
    dispatch(
      addColor({
        dataType,
        obsType: ObservationTypes.RADAR,
        color: newColor,
      })
    )
    newColor = randomColor.replace(/,[^,]+$/, ',0.33)')
    dispatch(
      addColor({
        dataType,
        obsType: ObservationTypes.REFERENCE,
        color: newColor,
      })
    )
  }, [dataType])

  useEffect(() => {
    if (active.length > 10) {
      addChartColor()
    }
  }, [active, addChartColor])

  return {
    isOneLakeActive,
    theme,
    toggleTheme,
    handleCanvas,
    canvas,
    noData,
    handleSetNoData,
    noDataFound,
  }
}
