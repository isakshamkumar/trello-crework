"use client"
import React from 'react';
import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ToastContainer } from 'react-toastify';
import { initializeStore, store, persistor, noopStore } from '../store';
import 'react-toastify/dist/ReactToastify.css';


type ReduxProviderProps={
    children: React.ReactNode;  
}
const ReduxProvider:React.FC<ReduxProviderProps>=({children}) =>{
  const isServer = typeof window === 'undefined';
  const storeToUse = isServer ? noopStore : initializeStore();
  return (
    <Provider store={storeToUse}>
       {!isServer && (
        <PersistGate loading={null} persistor={persistor!}>
         {children}
          <ToastContainer />
        </PersistGate>
      )}
      {isServer && children}
    </Provider>
  );
}

export default ReduxProvider;