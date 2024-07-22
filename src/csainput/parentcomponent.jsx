// ParentComponent.jsx
import React from 'react';
import ChildComponent from './childcomponent.jsx';

function ParentComponent() {
  const myVariable = "Hello from Parent";

  return (
    <div>
      <ChildComponent passedVariable={myVariable} />
    </div>
  );
}

export default ParentComponent;