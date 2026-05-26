import React from 'react';

/** Input with icon — prevents icon/text overlap */
export const IconInput = ({
  icon: Icon,
  label,
  className = '',
  inputClassName = '',
  ...inputProps
}) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <span className="field-label">{label}</span>}
    <div className="input-icon-wrap">
      {Icon && <Icon className="input-icon" aria-hidden />}
      <input className={`glass-input input-with-icon ${inputClassName}`} {...inputProps} />
    </div>
  </div>
);

export default IconInput;
