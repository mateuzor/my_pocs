import React from 'react';
import ReactDOM from 'react-dom';
import Button from 'remote/Button';

const App = () => (
  <div>
    <h1>Host App</h1>
    <Button />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
