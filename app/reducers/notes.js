const initialState = {
	notes: []
}

const addNote = (state = {}, action) => {
	let current = action.current,
		newData = []
	action.current.unshift(action.data)
	return action.current
}

const notes = (state = [], action) => {
  switch (action.type) {
    case 'UPDATE_NOTES':
    	return action.data
    case 'ADD_NOTE':
    	return addNote(undefined, action)
    default:
      return state
  }
}

export default notes