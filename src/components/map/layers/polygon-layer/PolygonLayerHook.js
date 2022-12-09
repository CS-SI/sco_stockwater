import { useMap, useMapEvents } from 'react-leaflet'
import { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addLake, updateActivelakes } from '@/stores/stateLakeSlice'
import { updateModeVolume } from '../../../../stores/dataSlice'
import { DurationTypes } from '../../../../config'
import {
  addLakeChartOptions,
  toggleLakeChartSelection
} from '../../../../stores/lakesChartOptionsSlice'
import { addYearsChartOptions } from '../../../../stores/yearsChartOptionsSlice'

export default function usePolygonLayerHook() {
  const [color, setColor] = useState('blue')
  const [zoomLevel, setZoomLevel] = useState(null)
  const [containerHeight, setContainerHeight] = useState(null)
  const [coordId, setCoordId] = useState({
    id: '',
    coord: []
  })
  const [obsDepth, setObsDepth] = useState(null)
  const { YEAR, DAY, PERIOD, VOLUME, dataType } = useSelector(
    state => state.form
  )
  const { active } = useSelector(state => state.stateLake)
  const { information } = useSelector(state => state.information)
  const { lakesChartOptions } = useSelector(state => state)
  const { data: dataFromStore, loaded } = useSelector(state => state.data)
  const map = useMap()
  const dispatch = useDispatch()

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom())
    }
  })

  const resizeMap = useCallback(
    value => {
      const container = document.getElementsByClassName('leaflet-container')
      if (container) {
        map.invalidateSize(true)
        map._onResize(true)
        container[0].style.height = value
      }
    },
    [map]
  )

  const centerPolygon = useCallback(() => {
    map.setView(coordId.coord, 11)
  }, [coordId])

  useEffect(() => {
    if (active.length >= 2) return
    if (
      active.length === 1 &&
      dataFromStore[coordId.id]?.[dataType]?.[obsDepth]?.raw[0].length > 0 &&
      containerHeight !== '45%'
    ) {
      resizeMap('45%')
      setContainerHeight('45%')
    }
    if (active.length === 0 && containerHeight !== '100%') {
      resizeMap('100%')
      setContainerHeight('100%')
      setCoordId({
        id: '',
        coord: []
      })
    }
  }, [active.length, dataFromStore, dataType, obsDepth, resizeMap, coordId.id])

  useEffect(() => {
    if (containerHeight === '100%' && coordId.coord.length > 0) {
      map.invalidateSize(true)
      map.setView(coordId.coord, map.getZoom() - 1)
    }
  }, [containerHeight])

  useEffect(() => {
    if (!lakesChartOptions[coordId.id] && containerHeight === '100%') return
    if (containerHeight === '45%' && active.length > 0) {
      setColor('#CDF0EA')
      map.invalidateSize(true)
      centerPolygon()
    }
  }, [containerHeight, lakesChartOptions[coordId.id]])

  useEffect(() => {
    if (active.length < 1) {
      setColor('blue')
    }
  }, [active.length, lakesChartOptions])

  useEffect(() => {
    if (DAY) {
      setObsDepth(DurationTypes.DAY)
    }
    if (PERIOD) {
      setObsDepth(DurationTypes.PERIOD)
    }
  }, [DAY, PERIOD])
  useEffect(() => {
    if (!lakesChartOptions[coordId.id]) {
      setColor('blue')
    }
  }, [lakesChartOptions])

  const centerSelectedPolygon = useCallback(() => {
    if (
      Object.entries(lakesChartOptions)
        .map(([id, { selected }]) => {
          return { id, selected }
        })
        .filter(({ selected }) => selected).length === 0
    )
      return

    const { lakeId } = Object.entries(lakesChartOptions)
      .map(([id, { selected }]) => {
        return { lakeId: id, selected }
      })
      .filter(({ selected }) => selected)[0]
    const { id, lakeCoord } = information[lakeId]
    setCoordId({
      id,
      coord: lakeCoord
    })
  }, [lakesChartOptions])

  useEffect(() => {
    centerSelectedPolygon()
  }, [centerSelectedPolygon])

  const activeLake = useCallback(
    (id, coordWW) => {
      setCoordId({
        id: id.toString(),
        coord: coordWW
      })
      dispatch(addLake({ id: id.toString() }))
    },
    [dispatch]
  )

  const updateLake = useCallback(
    (id, coordWW, obsDepth) => {
      setCoordId({
        id: id.toString(),
        coord: coordWW
      })
      dispatch(updateActivelakes({ id: id.toString() }))
      dispatch(addLakeChartOptions({ id: id.toString() }))
      if (!VOLUME) return
      dispatch(updateModeVolume({ id: id.toString(), obsDepth }))
    },

    [dispatch, obsDepth]
  )

  useEffect(() => {
    if (active.length === 0) return
    if (YEAR && dataFromStore[active.at(-1)]) {
      const dataYears = dataFromStore[active.at(-1)][dataType][obsDepth].year
      const years = Object.keys(dataYears)
      dispatch(addYearsChartOptions({ years }))
    }
  }, [dispatch, YEAR, active, dataType, obsDepth, loaded, dataFromStore])

  return {
    activeLake,
    centerPolygon,
    id: coordId.id,
    color,
    zoomLevel,
    loaded,
    active,
    updateLake,
    obsDepth,
    dataFromStore,
    dataType,
    dispatch
  }
}
