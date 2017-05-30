export const showNav = () => {
  return {
    type: 'SHOW_NAV',
  }
}

export const hideNav = () => {
  return {
    type: 'HIDE_NAV',
  }
}

export const advancedOn = () => {
  return {
    type: 'SHOW_ADVANCED',
  }
}

export const advancedOff = () => {
  return {
    type: 'HIDE_ADVANCED',
  }
}

export const getNotes = (data) => {
  return {
    type: 'GET_NOTES',
    data
  }
}

export const updateNotes = (data) => {
  return {
    type: 'UPDATE_NOTES',
    data
  }
}

export const moreNotes = (prevData, data) => {
  let allData = {
    prev: prevData,
    new: data
  }
  return {
    type: 'MORE_NOTES',
    allData
  }
}

export const updateNote = (current, data) => {
  return {
    type: 'UPDATE_NOTE',
    current: current,
    data: data
  }
}

export const addNote = (current, data) => {
  return {
    type: 'ADD_NOTE',
    current: current,
    data: data
  }
}

export const saveNote = (data) => {
  return {
    type: 'SAVE_NOTE',
    data: data
  }
}

export const signIn = (data) => {
	return {
	type: 'SAVE_USER',
	data
	}
}

export const signOut = () => {
  return {
  type: 'REMOVE_USER'
  }
}

export const searchNotes = (data) => {
  return {
    type: 'SEARCH_NOTES',
    data
  }
}

export const searchArchivedNotes = (data) => {
  return {
    type: 'SEARCH_ARCHIVED_NOTES',
    data
  }
}