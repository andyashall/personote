import { combineReducers } from 'redux'
import user from './login'
import notes from './notes'
import note from './note'
import login from './login'
import nav from './nav'
import search from './search'

const app = combineReducers({
  user,
  notes,
  note,
  login,
  nav,
  search
})

export default app