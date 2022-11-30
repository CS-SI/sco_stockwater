/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import { useAppHook } from './AppHook'
import { Map } from '@components/map/Map'
import { Chart } from '@components/chart/Chart'
import { Dashboard } from '@components/dashboard/Dashboard'
import { Modal } from './components/modal/Modal'
import { globalStyles, styled, darkTheme } from '@/stitches.config'
globalStyles()
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { Header } from './components/header/Header'

const SAppContainer = styled('div', {
  display: 'flex',
  width: '100ww',
  height: '92vh',
})

const SMapChartContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  height: '92vh',
  width: '87vw',
  position: 'relative',
})

const Container = styled('div', {
  backgroundColor: '$background',
  color: '$text',
})
const themeMap = {
  light: null,
  dark: darkTheme,
}
const App = () => {
  const {
    toggleTheme,
    theme,
    showLakeInfo,
    isOneLakeActive,
    handleSetNoData,
    handleCanvas,
    canvas,
    noData,
    noDataFound,
  } = useAppHook()
  return (
    <Container className={themeMap[theme]}>
      <Header toggleTheme={toggleTheme} theme={theme} />
      {showLakeInfo && <LakeCard />}
      <SAppContainer>
        <Dashboard canvas={canvas} />
        <SMapChartContainer>
          {noData && (
            <Modal
              isOpen={noData}
              handleSetNoData={handleSetNoData}
              noDataFound={noDataFound}
            />
          )}
          <Map isOneLakeActive={isOneLakeActive} />
          {isOneLakeActive && <Chart handleCanvas={handleCanvas} />}
        </SMapChartContainer>
      </SAppContainer>
    </Container>
  )
}

export default App
