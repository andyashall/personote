const initialState = {
	notes: {}
}

const note = (state = {}, action) => {
	switch (action.type) {
		// this gets the notes if there arent any already
		case 'GET_NOTES':
			return action.data
		//this gets more notes and adds them to the state.notes.data
		case 'MORE_NOTES': 
			var newData = action.allData.prev.concat(action.allData.new)
			console.log(action)
			return newData
		case 'REMOVE_NOTES': 
			return null
		default:
			return state
	}
}

const addNote = (state = {}, action) => {
	let current = action.current,
		newData = []
	action.current.unshift(action.data)
	return action.current
}

const notes = (state = [], action) => {
  switch (action.type) {
    case 'GET_NOTES':
    	return note(undefined, action)
    case 'MORE_NOTES':
    	return note(undefined, action)
    case 'UPDATE_NOTES':
    	return action.data
    case 'ADD_NOTE':
    	return addNote(undefined, action)
    default:
      return state
  }
}

export default notes