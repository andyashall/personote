import { combineReducers } from 'redux'
import user from './login'
import notes from './notes'
import note from './note'
import nav from './nav'
import search from './search'
import editor from './editor'
import archiveSearch from './archiveSearch'

const app = combineReducers({
  user,
  notes,
  note,
  nav,
  search,
  archiveSearch,
  editor
})

export default app