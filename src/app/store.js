import { configureStore } from '@reduxjs/toolkit'
import formReducer from '@stores/formSlice'
import lakesReducer from '@stores/lakesSlice'
import chartReducer from '@stores/chartSlice'
import staticLakeSlice from '@stores/staticLakeSlice'
import stateLakeSlice from '@stores/stateLakeSlice'
import dataSlice from '@stores/dataSlice'
import lakesChartOptionsSlice from '@stores/lakesChartOptionsSlice'
import yearsChartOptionsSlice from '@stores/yearsChartOptionsSlice'
import chartDataLoadedSlice from '../stores/chartDataLoadedSlice'
export const store = configureStore({
  reducer: {
    form: formReducer,
    lakes: lakesReducer,
    chart: chartReducer,
    information: staticLakeSlice,
    stateLake: stateLakeSlice,
    data: dataSlice,
    lakesChartOptions: lakesChartOptionsSlice,
    yearsChartOptions: yearsChartOptionsSlice,
    chartDataLoaded: chartDataLoadedSlice,
    devTools: true
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 }
    })
})
