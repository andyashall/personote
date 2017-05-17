const initialState = {
	notes: {}
}

const note = (state = {}, action) => {
	switch (action.type) {
		// this gets the notes if there arent any already
		case 'GET_NOTES':
			var expires = new Date();
			expires.setMinutes(expires.getMinutes() + 10);
			return {
				expires: expires,
				data: action.data
			}
		//this gets more notes and adds them to the state.notes.data
		case 'MORE_NOTES': 
			var newData = action.allData.prev.data.concat(action.allData.new)
			console.log(action)
			return {
				expires: action.allData.prev.expires,
				data: newData
			}
		case 'REMOVE_NOTES': 
			return null
		default:
			return state
	}
}

const updateNote = (state = {}, action) => {
	let current = action.current.data,
		newData = []
	Object.keys(current).forEach((i) => {
		if (current[i]._id == action.data._id) {
			current[i].title = action.data.title
			current[i].content = action.data.content
			current[i].preview = action.data.preview
			current[i].updated = new Date()
			return action.current
		}
	})
	
}

const removeNote = (state = {}, action) => {
	let current = action.current.data,
		newData = []
	Object.keys(current).forEach((i) => {
		if (current[i]._id == action.data._id) {
			current.splice(i,1)
			return action.current
		}
	})	
}

const addNote = (state = {}, action) => {
	let current = action.current.data,
		newData = []
	action.current.data.unshift(action.data)
	return action.current
}

const notes = (state = [], action) => {
  switch (action.type) {
    case 'GET_NOTES':
    	return note(undefined, action)
    case 'MORE_NOTES':
    	return note(undefined, action)
    case 'UPDATE_NOTE':
    	return updateNote(undefined, action)
    case 'REMOVE_NOTE':
    	return removeNote(undefined, action)
    case 'ADD_NOTE':
    	return addNote(undefined, action)
    default:
      return state
  }
}

export default notes