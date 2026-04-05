import React from 'react';
import ReactDOM from 'react-dom/client';
import VirtualizedList from './components/VirtualizedList';
import FixedSizeListDemo from './components/FixedSizeListDemo';
import VariableSizeListDemo from './components/VariableSizeListDemo';
import FixedSizeGridDemo from './components/FixedSizeGridDemo';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <VirtualizedList />
    <FixedSizeListDemo />
    <VariableSizeListDemo />
    <FixedSizeGridDemo />
  </React.StrictMode>
);
