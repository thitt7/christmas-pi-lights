import { configureStore } from "@reduxjs/toolkit" 


const initState = {
  
  context: {},
  source: {},
  queue: [],
  playing: false,
  index: 0,
}

const Reducer = (state = initState, action: any) => {
  switch (action.type) {

    case 'SET_CONTEXT':
      console.log(action.context)
      return {
        ...state,
        context: action.context,
      }

    case 'SET_SOURCE':
      return {
        ...state,
        source: action.source,
      }

    case 'SET_PLAYING':
      return {
        ...state,
        playing: action.playing,
      }

      case 'SET_ANSWERED':
        return {
          ...state,
          isAnswered: action.answered
        }

    default:
      return state
  }
}

const store = configureStore({
    reducer: Reducer
})

export default store

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch