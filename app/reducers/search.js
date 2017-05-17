const initialState = {
	search: true
}

const search = (state = "", action) => {
	switch (action.type) {
		case 'SEARCH_NOTES':
			return action.data
		case 'HIDE_SEARCH': 
			return false
		default:
			return state
	}
}

export default search