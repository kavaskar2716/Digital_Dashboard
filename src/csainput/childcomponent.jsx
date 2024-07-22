// ChildComponent.jsx
import React from 'react';

function ChildComponent(props) {
  // Log the value of passedVariable to the console for debugging
  console.log("Value of passedVariable in ChildComponent:", props.passedVariable);

  return (
    <div>
      {/* Render the value of passedVariable prop */}
      <p>Value passed from parent: {props.passedVariable}</p>
    </div>
  );
}

export default ChildComponent;
