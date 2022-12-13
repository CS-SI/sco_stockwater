import { createSlice, current } from '@reduxjs/toolkit'
import { remove } from 'jszip'
import {
  AppConfig,
  DataTypes,
  DurationTypes,
  ObservationTypes,
  SeriePathUtils,
} from '../config/index'
import { removeDiacritics } from './../utils/value'
const initialState = {
  information: {},
  seriePath: {},
}

const { getSeriePath, getTimeseriesPath } = SeriePathUtils
export const staticLakeSlice = createSlice({
  name: 'information',
  initialState,
  reducers: {
    addInformation: (state, action) => {
      const { id, info } = action.payload
      const name = removeDiacritics(info.name.replace(/\s/g, '_'))

      if (!state.information[id]) {
        state.information[id] = info
      }

      if (!state.seriePath[id]) {
        const serieTmp = []

        const fillingRateOptic10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.FILLING_RATE].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const fillingRateOpticDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.FILLING_RATE].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const fillingRateRadar10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.FILLING_RATE].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const fillingRateRadarDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.FILLING_RATE].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const volumeOptic10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.VOLUME].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const volumeOpticDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.VOLUME].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const volumeRadar10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.VOLUME].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const volumeRadarDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.VOLUME].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const surfaceOptic10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.SURFACE].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const surfaceOpticDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.SURFACE].filePath,
          AppConfig.observationTypes[ObservationTypes.OPTIC].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const surfaceRadar10Days = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.SURFACE].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.PERIOD].abbr
        )

        const surfaceRadarDay = getSeriePath(
          id,
          name,
          AppConfig.attributes[DataTypes.SURFACE].filePath,
          AppConfig.observationTypes[ObservationTypes.RADAR].abbr,
          AppConfig.duration[DurationTypes.DAY].abbr
        )

        const referenceSerie = getTimeseriesPath(id, name)

        serieTmp.push(
          fillingRateOpticDay,
          fillingRateOptic10Days,
          fillingRateRadarDay,
          fillingRateRadar10Days,
          volumeOpticDay,
          volumeOptic10Days,
          volumeRadarDay,
          volumeRadar10Days,
          surfaceOpticDay,
          surfaceOptic10Days,
          surfaceRadarDay,
          surfaceRadar10Days,
          referenceSerie
        )

        state.seriePath[id] = serieTmp
      }
    },
  },
})

export const { addInformation } = staticLakeSlice.actions

export default staticLakeSlice.reducer
