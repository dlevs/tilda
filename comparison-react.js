// React
//------------------

// State
{
	oscillators: [
		{
			frequency: 400,
			gain: 0.8
		},
		{
			frequency: 800,
			gain: 0.5
		}
	]
}


// Component
const OscControls = ({frequency, gain}) => (
	<fieldset>
		<input
			min={20}
			max={20000}
			value={frequency}
		/>
		<input
			min={20}
			max={20000}
			value={frequency}
		/>
	</fieldset>
);


// Composition and output
ReactDOM.render(
	<div>
		{state.oscillators.map(OscControls}
	</div>,
	document.getElementById('root')
);

