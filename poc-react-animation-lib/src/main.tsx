import React from 'react';
import ReactDOM from 'react-dom/client';
import ExampleComponent from './components/ExampleComponent';
import MotionBasic from './components/MotionBasic';
import AnimatePresenceDemo from './components/AnimatePresenceDemo';
import GestureDemo from './components/GestureDemo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExampleComponent />
    <MotionBasic />
    <AnimatePresenceDemo />
    <GestureDemo />
  </React.StrictMode>
);
