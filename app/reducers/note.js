const initialState = {
	note: {}
}

const note = (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_NOTE':
			return action.data
		case 'REMOVE_NOTE': 
			return null
		default:
			return state
	}
}

export default note