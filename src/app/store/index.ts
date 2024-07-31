import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import taskReducer from './slices/taskSlice';
import authReducer from './slices/authSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth']
};

const rootReducer = combineReducers({
  tasks: taskReducer,
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: persistedReducer,
    preloadedState: preloadedState as any,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const initializeStore = (preloadedState?: Partial<RootState>) => {
  let _store = store ?? makeStore(preloadedState);

  if (typeof window === 'undefined') return _store;

  if (!store) {
    store = _store;
    persistor = persistStore(store);
  }

  return _store;
};

export let store: ReturnType<typeof makeStore>;
export let persistor: ReturnType<typeof persistStore>;

if (typeof window !== 'undefined') {
  store = makeStore();
  persistor = persistStore(store);
}

export type AppDispatch = typeof store.dispatch;

export const noopStore = makeStore();