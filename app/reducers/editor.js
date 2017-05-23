const initialState = {
	editor: false
}

const editor = (state = false, action) => {
	switch (action.type) {
		case 'SHOW_ADVANCED':
			return true
		case 'HIDE_ADVANCED': 
			return false
		default:
			return state
	}
}

export default editor