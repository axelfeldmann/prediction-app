import React from 'react';
import classnames from 'classnames';

const Expandable = ({ toggleFn, expanded, children, label }) => {
  const labelClasses = classnames('expandable-label', {
    'expanded': expanded,
    'collapsed': !expanded
  });

  const chevronClasses = classnames('chevron', {
    'bottom': expanded,
    'right': !expanded
  });

  return (
    <div  className='expandable-container'>
      <div className={ labelClasses } onClick={ toggleFn }>
        <span className={ chevronClasses }/>
        <label>{ label }</label>
      </div>
      { (expanded) ? <div className='expanded-content'>{ children }</div> : null }
    </div>
  );
};

export default Expandable;