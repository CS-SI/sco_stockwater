import ReactTooltip from 'react-tooltip'
import useLakeBoardHook from './LakeBoardHook'
import { LakeSelection } from './lake-selection/LakeSelection'
import { styled, theme } from '@/stitches.config'
import { v4 as uuid } from '@lukeed/uuid'
import { CarbonCloseOutline } from '../carbon-icons'
import { LakeCard } from './lake-card/LakeCard'
const Container = styled('div', {
  color: '$text',
  display: 'flex',
  flexDirection: 'column',
  height: '45%',
  padding: theme.space.sm,
  minWidth: '100%',
  maxWidth: '100%',
  overflow: 'auto',
})
const H3 = styled('h3', {
  fontFamily: 'sans-serif',
  marginBottom: theme.space.sm,
  fontSize: theme.fontSizes.base,
})

const HeadContainer = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
})
const Button = styled('button', {
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
const Tooltip = styled(ReactTooltip, {
  fontFamily: 'sans-serif',
  fontSize: `${theme.fontSizes.xs}!important`,
  marginTop: '0 !important',
  padding: '4px 8px !important',
  zIndex: '1111 !important',
})

export const LakeBoard = () => {
  const { VOLUME, clearSelection, activeLakesInfo, showInfo } =
    useLakeBoardHook()

  return (
    <Container>
      {showInfo && <LakeCard />}
      <HeadContainer>
        <H3>Selected reservoirs</H3>
        <Button data-tip data-for="removeSelection" onClick={clearSelection}>
          <CarbonCloseOutline fontSize={18} />
        </Button>
        <Tooltip id="removeSelection" place="top" effect="solid">
          <span>Remove selection</span>
        </Tooltip>
      </HeadContainer>

      {activeLakesInfo.length > 0 && (
        <>
          {VOLUME && <LakeSelection id="total" name="Total Volume" index={0} />}
          {activeLakesInfo.map((item, index) => (
            <LakeSelection
              key={uuid()}
              id={item.id}
              name={item.name}
              coordinates={item.coordinates}
              index={index}
            />
          ))}
        </>
      )}
    </Container>
  )
}
