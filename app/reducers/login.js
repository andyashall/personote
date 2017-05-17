const initialState = {
	user: {}
}

const user = (state = {}, action) => {
	switch (action.type) {
		case 'SAVE_USER':
			return action.data
		case 'REMOVE_USER': 
			return null
		default:
			return state
	}
}

export default user