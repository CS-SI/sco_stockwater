export const handleDataSetsBooleanOption = (
	arrDataSets,
	activeData,
	dataOption,
	dataSetOption,
	obsTypes
) => {
	const newData = [...arrDataSets]
	const activeDataIndex = activeData.map((el, index) => {
		return {
			index: index,
			[dataOption]: el[dataOption],
		}
	})
	for (const item of activeDataIndex) {
		const { index } = item
		const dataOptionValue = item[dataOption]

		if (obsTypes === 1) {
			if (dataOptionValue) {
				newData[index][dataSetOption] = false
			}
			if (!dataOptionValue) {
				newData[index][dataSetOption] = true
			}
		}

		if (obsTypes === 2) {
			if (dataOptionValue) {
				newData[index === 0 ? 0 : index * 2][dataSetOption] = false
				newData[index === 0 ? 1 : index * 2 + 1][dataSetOption] = false
			}
			if (!dataOptionValue) {
				newData[index === 0 ? 0 : index * 2][dataSetOption] = true
				newData[index === 0 ? 1 : index * 2 + 1][dataSetOption] = true
			}
		}
		if (obsTypes === 3) {
			if (dataOptionValue) {
				newData[index === 0 ? 0 : index * 3][dataSetOption] = false
				newData[index === 0 ? 1 : index * 3 + 1][dataSetOption] = false
				if (
					newData[index === 0 ? 2 : index * 3 + 2]?.[dataSetOption] !==
					undefined
				) {
					newData[index === 0 ? 2 : index * 3 + 2][dataSetOption] = false
				}
			}
			if (!dataOptionValue) {
				newData[index === 0 ? 0 : index * 3][dataSetOption] = true
				newData[index === 0 ? 1 : index * 3 + 1][dataSetOption] = true
				if (
					newData[index === 0 ? 2 : index * 3 + 2]?.[dataSetOption] !==
					undefined
				) {
					newData[index === 0 ? 2 : index * 3 + 2][dataSetOption] = true
				}
			}
		}
	}
	return newData
}
export const handleDataSetsBorderWidthOption = (
	arrDataSets,
	activeData,
	dataOption,
	dataSetOption,
	obsTypes,
	config
) => {
	const newData = [...arrDataSets]
	const activeDataIndex = activeData.map((el, index) => {
		return {
			index: index,
			[dataOption]: el[dataOption],
		}
	})
	for (const item of activeDataIndex) {
		const { index } = item
		const dataOptionValue = item[dataOption]

		if (obsTypes === 1) {
			if (dataOptionValue) {
				newData[index][dataSetOption] = config.style.selected[dataSetOption]
			}
			if (!dataOptionValue) {
				newData[index][dataSetOption] = config.style.default[dataSetOption]
			}
		}

		if (obsTypes === 2) {
			if (dataOptionValue) {
				newData[index === 0 ? 0 : index * 2][dataSetOption] =
					config.style.selected[dataSetOption]

				newData[index === 0 ? 1 : index * 2 + 1][dataSetOption] =
					config.style.selected[dataSetOption]
			}
			if (!dataOptionValue) {
				newData[index === 0 ? 0 : index * 2][dataSetOption] =
					config.style.default[dataSetOption]

				newData[index === 0 ? 1 : index * 2 + 1][dataSetOption] =
					config.style.default[dataSetOption]
			}
		}
		if (obsTypes === 3) {
			if (dataOptionValue) {
				newData[index === 0 ? 0 : index * 3][dataSetOption] =
					config.style.selected[dataSetOption]

				newData[index === 0 ? 1 : index * 3 + 1][dataSetOption] =
					config.style.selected[dataSetOption]
				if (newData[index === 0 ? 2 : index * 3 + 2]) {
					newData[index === 0 ? 2 : index * 3 + 2][dataSetOption] =
						config.style.selected[dataSetOption]
				}
			}
			if (!dataOptionValue) {
				newData[index === 0 ? 0 : index * 3][dataSetOption] =
					config.style.default[dataSetOption]
				newData[index === 0 ? 1 : index * 3 + 1][dataSetOption] =
					config.style.default[dataSetOption]
				if (newData[index === 0 ? 2 : index * 3 + 2]) {
					newData[index === 0 ? 2 : index * 3 + 2][dataSetOption] =
						config.style.default[dataSetOption]
				}
			}
		}
	}
	return newData
}
