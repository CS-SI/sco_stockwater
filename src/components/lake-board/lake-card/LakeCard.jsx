import { useState, useEffect, useCallback } from 'react'
import { CarbonClose } from '../../carbon-icons'
import { styled, theme } from '@/stitches.config.js'
import { toggleLakeChartInfoVisibility } from '@stores/lakesChartOptionsSlice'
import { useSelector } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import { useDispatch } from 'react-redux'
const SDiv = styled('div', {
  padding: '1.5rem',
  backgroundColor: '$background',
  position: 'absolute',
  top: '83px',
  left: '14vw',
  marginLeft: '10px',
  zIndex: '1111',
  borderRadius: theme.borderRadius.sm,
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'sans-serif',

  color: '$text',
})

const SpanCoord = styled('span', {
  fontWeight: 'bold',
})
const SButtonContainer = styled('div', {
  position: 'absolute',
  top: '5px',
  right: '5px',
})
const SButton = styled('button', {
  'borderStyle': 'none',
  'cursor': 'pointer',
  'height': '60%',
  'padding': '0',
  'display': 'grid',
  'placeItems': 'center',
  'width': '20px',
  'backgroundColor': 'transparent',
  'color': '$iconColor',

  '&:hover': {
    color: '$iconHoverColor',
  },
})

const SReactTooltip = styled(ReactTooltip, {
  fontFamily: 'sans-serif',
  fontSize: `${theme.fontSizes.xs}!important`,
  marginTop: '0 !important',
  padding: '4px 8px !important',
  zIndex: '1111 !important',
})

const SH2 = styled('h2', {
  fontFamily: 'sans-serif',
  marginBottom: theme.space.base,
})

const SArticle = styled('article', {})
const SDivId = styled('div', {
  marginBottom: theme.space.sm,
})
const SDivCoord = styled('div', {
  li: {
    listStyle: 'none',
  },
})
export const LakeCard = ({ id }) => {
  const [lake, setLake] = useState({
    id: '',
    country: '',
    name: '',
    lakeCoord: [],
    mainUse: '',
    nearCity: '',
    damCoord: [],
  })
  const { lakesChartOptions } = useSelector(state => state)
  const { information } = useSelector(state => state.information)
  const dispatch = useDispatch()
  useEffect(() => {
    const idLakeShowInfo = Object.entries(lakesChartOptions)
      .filter(([id, { infoVisible }]) => infoVisible)
      .map(([id]) => id)[0]
    if (!idLakeShowInfo) return
    const { id, country, name, lakeCoord, mainUse, nearCity, damCoord } =
      information[idLakeShowInfo]
    setLake({
      id,
      country,
      name,
      lakeCoord,
      mainUse,
      nearCity,
      damCoord,
    })
  }, [lakesChartOptions, information])

  const closeInfo = useCallback(() => {
    dispatch(toggleLakeChartInfoVisibility({ id: lake.id }))
  }, [dispatch, lake.id])

  return (
    <SDiv>
      <SButtonContainer>
        <SButton data-tip data-for="close" onClick={closeInfo}>
          <CarbonClose fontSize={14} />
        </SButton>
        <SReactTooltip id="close" place="right" effect="solid">
          <span>Close</span>
        </SReactTooltip>
      </SButtonContainer>
      <SH2>
        {lake.name} {lake.country}
      </SH2>
      <SArticle>
        <SDivId>
          <p>
            <span> Id SWOT :</span> {lake.id}
          </p>
          <p>
            <span>Main use :</span>{' '}
            {lake.mainUse !== 'NULL' ? lake.mainUse : 'n/a'}
          </p>
          <p>
            <span>Near city :</span>{' '}
            {lake.nearCity !== 'NULL' ? lake.nearCity : 'n/a'}
          </p>
        </SDivId>
        <SDivCoord>
          <p>
            <SpanCoord>Dam coordinates:</SpanCoord>
          </p>
          <ul>
            <li>lat : {lake.damCoord[0]}</li>
            <li>long : {lake.damCoord[1]}</li>
          </ul>
          <span>
            <SpanCoord>Reservoirs coordinates:</SpanCoord>
            <ul>
              <li>lat : {lake.lakeCoord[0]}</li>
              <li>long : {lake.lakeCoord[1]}</li>
            </ul>
          </span>
        </SDivCoord>
      </SArticle>
    </SDiv>
  )
}
