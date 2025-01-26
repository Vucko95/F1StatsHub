import { createSignal } from "solid-js";


import '../styles/slider .css'; // Import the CSS file

const DualRangeSlider = () => {
  const [minValue, setMinValue] = createSignal(1); // Starting value of the first slider
  const [maxValue, setMaxValue] = createSignal(24); // Starting value of the second slider

  return (
    <div>
      <h2>Select Races</h2>

      <div class="slider-container">
        {/* Background track */}
        <div class="background-track"></div>

        {/* Selected range track */}
        <div
          class="selected-range-track"
          style={{
            left: `${((minValue() - 1) / 23) * 100}%`,
            right: `${100 - ((maxValue() - 1) / 23) * 100}%`,
          }}
        ></div>

        {/* First slider */}
        <input
          type="range"
          min="1"
          max="24"
          value={minValue()}
          onInput={(e) => {
            const newValue = Math.min(Number(e.currentTarget.value), maxValue() - 1);
            setMinValue(newValue);
          }}
          class="range-slider first-slider"
        />

        {/* Second slider */}
        <input
          type="range"
          min="1"
          max="24"
          value={maxValue()}
          onInput={(e) => {
            const newValue = Math.max(Number(e.currentTarget.value), minValue() + 1);
            setMaxValue(newValue);
          }}
          class="range-slider second-slider"
        />
      </div>

      {/* Display the selected range */}
      <div>
        <span>Selected Range: </span>
        <strong>
          {minValue()} to {maxValue()}
        </strong>
      </div>
    </div>
  );
};

export default DualRangeSlider;
