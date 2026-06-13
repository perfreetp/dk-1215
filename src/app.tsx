import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { StoreProvider } from '@/store';
import './app.scss';

function App(props) {
  useEffect(() => {});
  useDidShow(() => {});
  useDidHide(() => {});

  return (
    <StoreProvider>
      {props.children}
    </StoreProvider>
  );
}

export default App;