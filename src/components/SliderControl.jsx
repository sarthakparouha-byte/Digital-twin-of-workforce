import React from 'react';

const SliderControl = ({ label, value, min, max, unit = '', onChange }) => {
  return (
    <div className="slider-control">
      <div className="slider-header">
        <label>{label}</label>
        <span className="slider-value">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={value} 
        onChange={(e) => onChange(Number(e.target.value))}
        className="styled-slider"
      />
    </div>
  );
};

export default SliderControl;
