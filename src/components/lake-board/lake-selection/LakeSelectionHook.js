import { useEffect, useCallback, useState } from 'react'
import { removeLake } from '@stores/stateLakeSlice'
import {
  toggleLakeChartSelection,
  toggleLakeChartVisibility,
  removeLakeChartOptions,
  toggleLakeChartInfoVisibility,
} from '@stores/lakesChartOptionsSlice'
import {
  toggleYearChartSelection,
  toggleYearChartVisibility,
} from '@stores/yearsChartOptionsSlice'
import { removeDataFromVolume } from '@stores/dataSlice'
import { saveAs } from 'file-saver'
import { useDispatch, useSelector } from 'react-redux'
import JSZip from 'jszip'
import { AppConfig, DurationTypes } from '../../../config'
import { getSeriePath } from '@/utils/seriePath'
export const useLakeSelectionHook = ({ id, coordinates, index, name }) => {
  const [bgOptic, setBgOptic] = useState({})
  const [bgRadar, setBgRadar] = useState({})
  const [bgReference, setBgReference] = useState({})
  const [isVisible, setIsVisible] = useState(true)
  const [isSelected, setIsSelected] = useState(false)
  const [obsDepth, setObsDepth] = useState(DurationTypes.PERIOD)
  const dispatch = useDispatch()
  const chartOptions = useSelector(state => state.chart)
  const { dataType, OPTIC, RADAR, YEAR, REFERENCE, VOLUME, DAY, PERIOD } =
    useSelector(state => state.form)
  const { form } = useSelector(state => state)

  const { lakesChartOptions } = useSelector(state => state)
  const { yearsChartOptions } = useSelector(state => state)
  const { data, mode } = useSelector(state => state.data)
  const { information, seriePath } = useSelector(state => state.information)
  const { active } = useSelector(state => state.stateLake)
  const setlakeIconsOptions = useCallback(() => {
    if (!YEAR && lakesChartOptions[id]) {
      setIsVisible(lakesChartOptions[id].visible)
      setIsSelected(lakesChartOptions[id].selected)
    }
    if (YEAR && yearsChartOptions[id]) {
      setIsVisible(yearsChartOptions[id].visible)
      setIsSelected(yearsChartOptions[id].selected)
    }
  }, [YEAR, id, lakesChartOptions, yearsChartOptions])

  useEffect(() => {
    if (DAY) {
      setObsDepth(DurationTypes.DAY)
    }
    if (PERIOD) {
      setObsDepth(DurationTypes.PERIOD)
    }
  }, [DAY, PERIOD])
  useEffect(() => {
    setlakeIconsOptions()
  }, [setlakeIconsOptions])

  useEffect(() => {
    if (YEAR) return
    setBgOptic({
      backgroundColor:
        chartOptions[dataType].style.OPTIC[index].backgroundColor,
    })
    setBgRadar({
      backgroundColor:
        chartOptions[dataType].style.RADAR[index].backgroundColor,
    })
    setBgReference({
      backgroundColor:
        chartOptions[dataType].style.REFERENCE[index].backgroundColor,
    })
  }, [chartOptions, dataType, index])

  useEffect(() => {
    if (!YEAR) return
    setBgOptic({
      backgroundColor:
        chartOptions.YEAR.style[`x${index}`].OPTIC.backgroundColor,
    })
    setBgRadar({
      backgroundColor:
        chartOptions.YEAR.style[`x${index}`].RADAR.backgroundColor,
    })
    setBgReference({
      backgroundColor:
        chartOptions.YEAR.style[`x${index}`].REFERENCE.backgroundColor,
    })
  }, [YEAR, index, chartOptions.YEAR.style])

  const handleClickDesactiveLake = useCallback(() => {
    dispatch(removeLake({ id }))
    dispatch(removeDataFromVolume({ id, obsDepth }))
    dispatch(removeLakeChartOptions({ id }))
  }, [dispatch, id])

  const toggleSelectedLake = useCallback(() => {
    if (!YEAR) {
      dispatch(toggleLakeChartSelection({ id }))
    }
    if (YEAR) {
      dispatch(toggleYearChartSelection({ year: id }))
    }
  }, [YEAR, dispatch, id])

  const toggleChartVisibilty = useCallback(() => {
    if (!YEAR) {
      dispatch(toggleLakeChartVisibility({ id }))
    }

    if (YEAR) {
      dispatch(toggleYearChartVisibility({ year: id }))
    }
  }, [YEAR, dispatch, id])

  const toggleInfo = useCallback(() => {
    dispatch(toggleLakeChartInfoVisibility({ id }))
  }, [dispatch, id])

  const handleDownloadFile = useCallback(async () => {
    const zip = new JSZip()
    const seriePathLakes = getSeriePath(seriePath[id], form)
    for (const path of seriePathLakes) {
      const fileName = path.split('/').pop().split('.')[0]
      const res = await fetch(path)
      const blob = await res.blob()
      zip.file(`${fileName}.csv`, blob)
    }
    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, `${name}_${dataType.toLowerCase()}.zip`)
    })
  }, [id, dataType])

  return {
    toggleChartVisibilty,
    handleClickDesactiveLake,
    handleDownloadFile,
    bgOptic,
    bgRadar,
    isVisible,
    toggleSelectedLake,
    isSelected,
    OPTIC,
    RADAR,
    REFERENCE,
    bgReference,
    YEAR,
    toggleInfo,
    VOLUME,
    dataType,
    obsDepth,
    data,
    information,
    active,
    mode,
  }
}
