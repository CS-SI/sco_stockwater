/* eslint-disable react/jsx-no-undef */
import { useLakeSelectionHook } from './LakeSelectionHook'
import { styled, theme } from '@/stitches.config'
import ReactTooltip from 'react-tooltip'
import { PropTypes } from 'prop-types'
import {
	CarbonCloseOutline,
	CarbonView,
	CarbonViewOff,
	CarbonDownload,
	CarbonInformation,
} from '../../carbon-icons'
import { useEffect } from 'react'
const StyledDiv = styled('div', {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
	height: '40px',
	border: '1px solid #ccc',
	borderRadius: theme.borderRadius.sm,
	marginBottom: theme.space.xs,
	padding: theme.space.xs,
})

const StyledContainerButton = styled('div', {
	width: '30%',
	height: '100%',
	display: 'flex',
	justifyContent: 'space-evenly',
	alignItems: 'center',
})

const StyledButton = styled('button', {
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

const StyledContainerP = styled('div', {
	width: '50%',
	maxWidth: '50%',
	maxHeigth: '100%',
})

const StyledParagraph = styled('p', {
	cursor: 'pointer',
	fontFamily: 'arial',
	paddingLeft: theme.space.sm,
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
})

const StyledDivObservationTypes = styled('div', {
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-evenly',
	width: '20%',
	// paddingLeft: theme.space.sm,
})

const StyledDivContainerObsTypes = styled('div', {
	height: '33%',
	display: 'flex',
	alignItems: 'center',
})

const StyledSpanObsColor = styled('span', {
	width: '8px',
	height: '8px',
	display: 'inline-block',
	zIndex: '1',
})
const SpanBgWhite = styled('span', {
	backgroundColor: 'white',
	position: 'relative',
	top: '0',
	left: '0',
	width: '8px',
	height: '8px',
	marginLeft: '-8px',
})

const StyledSpanLabel = styled('span', {
	fontFamily: 'arial',
	marginLeft: theme.space.xs,
	fontSize: theme.fontSizes.xs,
})

const StyledReactTooltip = styled(ReactTooltip, {
	fontFamily: 'arial',
	fontSize: `${theme.fontSizes.xs}!important`,
	marginTop: '0 !important',
	padding: '4px 8px !important',
	zIndex: '1111 !important',
})

const backgroundBorderColored = {
	borderColor: '$borderSelectedColor',
	backgroundColor: '$backgroundSelectedColor',
}

const increaseWidth = {
	width: '70%',
	maxWidth: '70%',
}

const fontBold = { fontWeight: 'bold' }

const decreaseWidth = {
	width: '10%',
}

// const DivWrapper = styled('div', {
// 	display: 'flex',
// 	alignItems: 'center',
// 	justifyContent: 'center',
// 	margin: '0 auto',
// 	padding: '0 20px',
// 	height: '100%',
// })

// let dots = '3'
// let dotWidth = '15px'
// let dotStartOpacity = '0.15'
// let dotAnimationSpeed = '1s'
// let dotAnimationScale = '1'
// const dotsAnimation = keyframes({
// 	'0%, 70%, 100%': {
// 		opacity: dotStartOpacity,
// 		transform: 'scale(dotAnimationScale)',
// 	},
// 	'35%': {
// 		opacity: 1,
// 		transform: 'scale(1)',
// 	},
// })

// const DivDotLoader = styled('div', {
// 	height: dotWidth,
// 	position: 'relative',
// 	padding: dotWidth,
// 	width: dotWidth * 5,
// 	margin: '0 auto',
// })

// const DivDot = styled('div', {
// 	'background': '#b7b7b7',
// 	'borderRadius': '50%',
// 	'float': 'left',
// 	'height': dotWidth,
// 	'opacity': dotStartOpacity,
// 	'position': 'relative',
// 	'left': 0,
// 	'top': 0,
// 	'transform': 'scale(dotAnimationScale)',
// 	'width': dotWidth,

// 	'@for $i from 1 to 4': {
// 		'&:nth-child(#{$i})': {
// 			animation: dotsAnimation dotAnimationSpeed '($i * 0.2s) ease-in-out infinite`,
// 			left: (dotWidth * ($i - 1)) / 2,
// 		},
// 	},
// })

export const LakeSelection = ({
	id,
	name,
	coordinates,
	index,
	showLakeInfo,
}) => {
	const {
		toggleChartVisibilty,
		handleClickDesactiveLake,
		handleDownloadFile,
		bgOptic,
		bgRadar,
		bgReference,
		isVisible,
		toggleSelectedLake,
		isSelected,
		OPTIC,
		RADAR,
		REFERENCE,
		YEAR,
		toggleInfo,
		VOLUME,
		data,
		active,
		information,
		dataType,
		obsDepth,
		mode,
	} = useLakeSelectionHook({ id, name, coordinates, index, showLakeInfo })
	if (active.includes(id) && !data[id]) {
		return (
			<StyledDiv>
				<StyledParagraph>
					Loading...
					{/* <DivWrapper> */}
					{/* 	<DivDotLoader> */}
					{/* 		<DivDot></DivDot> */}
					{/* 		<DivDot></DivDot> */}
					{/* 		<DivDot></DivDot> */}
					{/* 	</DivDotLoader> */}
					{/* </DivWrapper> */}
				</StyledParagraph>
			</StyledDiv>
		)
	} else {
		return (
			<StyledDiv css={isSelected && backgroundBorderColored}>
				{VOLUME && id === 'total' && (
					<StyledDivObservationTypes>
						{OPTIC && mode?.volume[obsDepth]?.raw[0]?.length > 0 && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgOptic} />
								<SpanBgWhite />
								<StyledSpanLabel>optic</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
						{RADAR && mode?.volume[obsDepth]?.raw[1]?.length > 0 && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgRadar} />
								<SpanBgWhite />
								<StyledSpanLabel>radar</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
						{REFERENCE && mode?.volume[obsDepth]?.raw[2]?.length > 0 && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgReference} />
								<SpanBgWhite />
								<StyledSpanLabel>ref</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
					</StyledDivObservationTypes>
				)}
				{!VOLUME && !YEAR && (
					<StyledDivObservationTypes>
						{OPTIC && data[id]?.[dataType]?.[obsDepth]?.raw[0]?.[0]?.date && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgOptic} />
								<SpanBgWhite />
								<StyledSpanLabel>optic</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
						{RADAR && data[id]?.[dataType]?.[obsDepth]?.raw[1]?.[0]?.date && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgRadar} />
								<SpanBgWhite />
								<StyledSpanLabel>radar</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
						{REFERENCE && data[id]?.[dataType]?.[obsDepth]?.raw[2]?.[0]?.date && (
							<StyledDivContainerObsTypes>
								<StyledSpanObsColor style={bgReference} />
								<SpanBgWhite />
								<StyledSpanLabel>ref</StyledSpanLabel>
							</StyledDivContainerObsTypes>
						)}
					</StyledDivObservationTypes>
				)}
				{YEAR && data[active.at(-1)] && (
					<StyledDivObservationTypes>
						{OPTIC &&
							Object.values(data[active.at(-1)]?.[dataType]?.[obsDepth]?.year)[
								index
							][0]?.length > 0 && (
								<StyledDivContainerObsTypes>
									<StyledSpanObsColor style={bgOptic} />
									<SpanBgWhite />
									<StyledSpanLabel>optic</StyledSpanLabel>
								</StyledDivContainerObsTypes>
							)}
						{RADAR &&
							Object.values(data[active.at(-1)]?.[dataType]?.[obsDepth]?.year)[
								index
							][1]?.length > 0 && (
								<StyledDivContainerObsTypes>
									<StyledSpanObsColor style={bgRadar} />
									<SpanBgWhite />
									<StyledSpanLabel>radar</StyledSpanLabel>
								</StyledDivContainerObsTypes>
							)}
						{REFERENCE &&
							Object.values(data[active.at(-1)]?.[dataType]?.[obsDepth]?.year)[
								index
							][2]?.length > 0 && (
								<StyledDivContainerObsTypes>
									<StyledSpanObsColor style={bgReference} />
									<SpanBgWhite />
									<StyledSpanLabel>ref</StyledSpanLabel>
								</StyledDivContainerObsTypes>
							)}
					</StyledDivObservationTypes>
				)}
				{/* {data[id] && ( */}
				{/* <> */}
				<StyledContainerP
					onClick={!VOLUME ? toggleSelectedLake : undefined}
					css={YEAR && increaseWidth}
				>
					<StyledParagraph css={isSelected && fontBold}>
						{YEAR &&
							active.length > 0 &&
							`${name} ${information[active.at(-1)].name}`}
						{!YEAR && name}
					</StyledParagraph>
				</StyledContainerP>
				<StyledContainerButton css={YEAR && decreaseWidth}>
					{!VOLUME && (
						<>
							{!isVisible && (
								<>
									<StyledButton
										data-tip
										data-for="visible"
										onClick={toggleChartVisibilty}
									>
										<CarbonView fontSize={16} />
									</StyledButton>
									<StyledReactTooltip id="visible" place="top" effect="solid">
										<span>Visible</span>
									</StyledReactTooltip>
								</>
							)}
							{isVisible && (
								<>
									<StyledButton
										data-tip
										data-for="hide"
										onClick={toggleChartVisibilty}
									>
										<CarbonViewOff fontSize={16} />
									</StyledButton>
									<StyledReactTooltip id="hide" place="top" effect="solid">
										<span>Hide chart</span>
									</StyledReactTooltip>
								</>
							)}
						</>
					)}
					{!YEAR && id !== 'total' && (
						<>
							<StyledButton data-tip data-for="info" onClick={toggleInfo}>
								<CarbonInformation fontSize={16} />
							</StyledButton>
							<StyledReactTooltip id="info" place="top" effect="solid">
								<span>Info</span>
							</StyledReactTooltip>
							{!VOLUME && (
								<>
									<StyledButton
										data-tip
										data-for="download"
										onClick={handleDownloadFile}
									>
										<CarbonDownload fontSize={16} />
									</StyledButton>
									<StyledReactTooltip id="download" place="top" effect="solid">
										<span>Download CSV</span>
									</StyledReactTooltip>
								</>
							)}
							<StyledButton
								data-tip
								data-for="remove"
								onClick={handleClickDesactiveLake}
							>
								<CarbonCloseOutline fontSize={16} />
							</StyledButton>
							<StyledReactTooltip
								id="remove"
								place="top"
								effect="solid"
								type="warning"
							>
								<span>Remove</span>
							</StyledReactTooltip>
						</>
					)}
				</StyledContainerButton>
			</StyledDiv>
		)
	}
}

LakeSelection.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	coordinates: PropTypes.array,
	index: PropTypes.number,
}
