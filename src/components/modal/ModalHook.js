import { useState, useEffect, useCallback } from 'react'

export default function useMapHook({ isOpen, handleSetNoData }) {
	const [open, setOpen] = useState(isOpen)

	const handleClose = useCallback(() => {
		setOpen(!open)
		handleSetNoData()
	}, [setOpen])

	return {
		open,
		handleClose,
	}
}
