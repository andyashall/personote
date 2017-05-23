import { combineReducers } from 'redux'
import user from './login'
import notes from './notes'
import note from './note'
import nav from './nav'
import search from './search'
import editor from './editor'

const app = combineReducers({
  user,
  notes,
  note,
  nav,
  search,
  editor
})

export default app