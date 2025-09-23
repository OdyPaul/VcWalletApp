import { Provider, useDispatch } from 'react-redux';
import { store } from './app/store';
import AppNavigation from './navigation/AppNavigation';
import { loadUser } from './features/auth/authSlice';
import { useEffect } from 'react';
import { View } from 'react-native';

function Root() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, []);
  return <AppNavigation />;
}

export default function App() {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
}
