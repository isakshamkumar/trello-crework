"use client";
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { store,  } from '../store';

type ReduxProviderProps={
    children: React.ReactNode;  
}
const ReduxProvider:React.FC<ReduxProviderProps>=({children}) =>{
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
        {children}
      {/* </PersistGate> */}
    </Provider>
  );
}

export default ReduxProvider;