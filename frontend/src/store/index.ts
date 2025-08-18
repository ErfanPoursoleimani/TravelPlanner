import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
// import userSlice from './slices/userSlice'
// store/index.js - Make sure you have this export
import { persistStore } from 'redux-persist'



export const store = configureStore({
    reducer: {
        auth: authSlice,
        // user: userSlice,
    },
})
export const persistor = persistStore(store)  // ← This line was missing!

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch