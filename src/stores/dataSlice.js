import { current } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { DataTypes, DurationTypes, ObservationTypes } from './../config'

const initialState = {
  data: {},
  loaded: [],
  mode: {
    volume: {
      raw: [],
    },
  },
}

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    addData: (state, action) => {
      const {
        id,
        dataType,
        dataWB,
        obsDepth,
        obsName,
        obsNameByYear,
        volumeFullDates,
      } = action.payload
      if (state.data[id]?.[dataType]?.[obsDepth]) return
      // !Exist
      if (!state.data[id]) {
        state.data[id] = {
          [dataType]: {
            [DurationTypes[obsDepth]]: {
              raw: dataWB[obsName],
              year: dataWB[obsNameByYear],
            },
          },
        }
      }

      // Exist
      if (!state.data[id]?.[dataType]?.[obsDepth]) {
        state.data[id][dataType] = {
          ...state.data[id][dataType],
          [DurationTypes[obsDepth]]: {
            raw: dataWB[obsName],
            year: dataWB[obsNameByYear],
          },
        }
      }

      if (!state.loaded.includes(id)) {
        state.loaded.push(id)
      }

      if (dataType !== DataTypes.VOLUME) return

      state.data[id][dataType][obsDepth] = {
        ...state.data[id][dataType][obsDepth],
        full: dataWB[volumeFullDates],
      }

      if (state.mode.volume.raw.length === 0) {
        state.mode.volume.raw = dataWB[volumeFullDates]
      } else {
        const modeVolumeFirstDate = state.mode.volume.raw[0][0].date
        const modeVolumeLastDate = state.mode.volume.raw[0].at(-1).date

        const volumeFirstDate = dataWB[volumeFullDates][0][0].date
        const volumeLastDate = dataWB[volumeFullDates][0].at(-1).date

        let dayFirstDate = modeVolumeFirstDate
        let dayLastDate = modeVolumeLastDate

        if (volumeFirstDate >= modeVolumeFirstDate) {
          dayFirstDate = volumeFirstDate
        }
        if (volumeLastDate <= modeVolumeLastDate) {
          dayLastDate = volumeLastDate
        }

        const volumeFilter = dataWB[volumeFullDates].map(obs => {
          return obs.filter(o => {
            return o.date >= dayFirstDate && o.date <= dayLastDate
          })
        })

        state.mode.volume.raw = state.mode.volume.raw.map(obs => {
          return obs.filter(o => {
            return o.date >= dayFirstDate && o.date <= dayLastDate
          })
        })

        state.mode.volume.raw = state.mode.volume.raw.map((obs, index) => {
          return obs.map((el, i) => {
            const { date, value } = volumeFilter[index][i]
            if (el.date === date) {
              return {
                date: el.date,
                value: el.value + value,
              }
            }
          })
        })
      }
    },
    removeDataFromVolume: (state, action) => {
      const { id, obsDepth, activeLake } = action.payload
      if (activeLake.length === 0) {
        state.mode.volume.raw = []
      }
      if (activeLake.length === 1) {
        state.mode.volume.raw = state.data[id].VOLUME?.[obsDepth].full
      }
      if (activeLake.length > 1) {
        const volumeRawToRemove = state.data[id].VOLUME?.[obsDepth].full.map(
          el => {
            return el.filter(
              el =>
                el.date >= state.mode.volume.raw[0][0].date &&
                el.date <= state.mode.volume.raw[0].at(-1).date
            )
          }
        )

        state.mode.volume.raw = state.mode.volume.raw.map((obs, index) => {
          return obs.map((el, i) => {
            const { date, value } = volumeRawToRemove[index][i]
            if (el.date == date) {
              return {
                date: el.date,
                value: el.value > value ? el.value - value : value - el.value,
              }
            }
          })
        })
      }
    },
    updateModeVolume: (state, action) => {
      const { id, obsDepth } = action.payload
      if (state.mode.volume.raw.length === 0) {
        state.mode.volume.raw = state.data[id].VOLUME[obsDepth].full
      } else {
        const modeVolumeFirstDate = state.mode.volume.raw[0]?.[0].date
        const modeVolumeLastDate = state.mode.volume.raw[0]?.at(-1).date

        const volumeFirstDate = state.data[id].VOLUME[obsDepth].full[0][0].date
        const volumeLastDate =
          state.data[id].VOLUME[obsDepth].full[0].at(-1).date

        let dayFirstDate = modeVolumeFirstDate
        let dayLastDate = modeVolumeLastDate

        if (volumeFirstDate >= modeVolumeFirstDate) {
          dayFirstDate = volumeFirstDate
        }
        if (volumeLastDate <= modeVolumeLastDate) {
          dayLastDate = volumeLastDate
        }

        const volumeFilter = state.data[id].VOLUME[obsDepth].full.map(obs => {
          return obs.filter(o => {
            return o.date >= dayFirstDate && o.date <= dayLastDate
          })
        })

        state.mode.volume.raw = state.mode.volume.raw.map(obs => {
          return obs.filter(o => {
            return o.date >= dayFirstDate && o.date <= dayLastDate
          })
        })

        state.mode.volume.raw = state.mode.volume.raw.map((obs, index) => {
          return obs.map((el, i) => {
            const { date, value } = volumeFilter[index][i]
            if (el.date === date) {
              return {
                date: el.date,
                value: el.value + value,
              }
            }
          })
        })
      }
    },
    resetModeVolume: state => {
      state.mode.volume = {
        raw: [],
      }
    },
  },
})
export const {
  addData,
  removeDataFromVolume,
  updateModeVolume,
  resetModeVolume,
} = dataSlice.actions

export default dataSlice.reducer
