import useButtonHook from './ButtonHook'
import { styled } from '@stitches/react'
import { PropTypes } from 'prop-types'

const StyledButton = styled('button', {
  fontFamily: 'sans-serif',
  textTransform: 'capitalize',
  cursor: 'pointer',
})

export const Button = ({ type, value, cleanForm }) => {
  const { onClick } = useButtonHook(cleanForm)

  return (
    <StyledButton type={type} value={value} onClick={onClick}>
      {value}
    </StyledButton>
  )
}
Button.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  cleanForm: PropTypes.func.isRequired,
}
