const initialState = {
	archiveSearch: true
}

const archiveSearch = (state = "", action) => {
	switch (action.type) {
		case 'SEARCH_ARCHIVED_NOTES':
			return action.data
		case 'HIDE_SEARCH': 
			return false
		default:
			return state
	}
}

export default archiveSearch