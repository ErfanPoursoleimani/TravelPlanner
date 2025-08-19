import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
/* import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store' */


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Provider store={store}> */}
      {/* <PersistGate loading={<div>Loading...</div>} persistor={persistor}> */}
        <GoogleOAuthProvider clientId="213670148556-dq7i7pqpnmltnt6hdeftn2fl41ljpod2.apps.googleusercontent.com">
          <Theme>
            <App />
          </Theme>
        </GoogleOAuthProvider>
      {/* </PersistGate> */}
    {/* </Provider> */}
  </StrictMode>,
)
