import useMapHook from './ModalHook'
import { styled, theme } from '@/stitches.config'
import { CarbonClose, CarbonWarningAlt } from '../carbon-icons'
import ReactTooltip from 'react-tooltip'
const Div = styled('div', {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: '1111',
  width: '350px',
  height: '150px',
  backgroundColor: 'white',
  color: 'black',
  border: `1px solid ${theme.colors.disaster}`,
  borderRadius: theme.borderRadius.xs,
  padding: theme.space.sm,
  fontFamily: 'sans-serif',
})

const ButtonContainer = styled('div', {
  position: 'absolute',
  top: '5px',
  right: '5px',
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
    color: 'black',
  },
})

const Tooltip = styled(ReactTooltip, {
  fontFamily: 'sans-serif',
  fontSize: `${theme.fontSizes.xs}!important`,
  marginTop: '0 !important',
  padding: '4px 8px !important',
  zIndex: '1111 !important',
})

const Title = styled('div', {
  'display': 'flex',
  '& p': {
    fontSize: theme.fontSizes.lg,
    marginLeft: theme.space.base,
  },
})

const Container = styled('div', {
  display: 'grid',
  placeItems: 'center',
  height: '80%',
})

const Message = styled('p', {
  fontSize: theme.fontSizes.base,
})
const ButtonOk = styled('button', {
  'borderStyle': 'none',
  'cursor': 'pointer',
  'height': '60%',
  'padding': '0',
  'display': 'grid',
  'placeItems': 'center',
  'width': '40%',
  'backgroundColor': 'rgba(233, 72, 63, 0.5)',
  'color': theme.colors.white,
  'fontSize': theme.fontSizes.base,

  '&:hover': {
    backgroundColor: theme.colors.disaster,
  },
})

export const Modal = ({ isOpen, handleSetNoData, noDataFound }) => {
  const { open, handleClose } = useMapHook({
    isOpen,
    handleSetNoData,
    noDataFound,
  })
  return (
    <>
      {open && (
        <Div>
          <ButtonContainer>
            <Button data-tip data-for="close" onClick={handleClose}>
              <CarbonClose fontSize={14} />
            </Button>
            <Tooltip id="close" place="top" effect="solid">
              <span>Close</span>
            </Tooltip>
          </ButtonContainer>
          <Title>
            <CarbonWarningAlt fontSize={22} color={theme.colors.disaster} />
            <p>Ooops !</p>
          </Title>
          <Container>
            <Message>
              No{' '}
              {noDataFound.map(el => {
                if (noDataFound.length > 1 && noDataFound.length <= 2) {
                  return el + ', '
                } else if (noDataFound.length === 1) {
                  return el + ' '
                }
              })}
              time serie available
            </Message>
            <ButtonOk onClick={handleClose}>OK</ButtonOk>
          </Container>
        </Div>
      )}
    </>
  )
}
