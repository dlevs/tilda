// Tilda
//------------------


const tilda = {
	// Constant for output of a component
	OUTPUT: 'OUTPUT'
}
// TODO: add midiToFrequency fn
const mtof = (note) => note;


// State
const state = {
	activeVoices: [
		{
			timestamp: 12012912912,
			id: '12012912912',
			note: 69,
			velocity: 120
		},
		{
			timestamp: 12012914002,
			id: '12012914002',
			note: 71,
			velocity: 98
		}
	],
	ampModRate: 2,
	ampModDepth: 0.5,
	freqModRate: 6,
	freqModDepth: 20
};

// Component
const Osc = ({id, frequency, gain}) => ({
	id,
	nodes: [
		{
			id: 'osc',
			NodeType: 'oscillator',
			type: 'sawtooth',
			frequency
		},
		{
			id: 'gain',
			NodeType: 'gain',
			gain
		}
	],
	connections: [
		['osc', 'gain', tilda.OUTPUT]
	],
	input: 'osc'
});

const Synth = ({
	activeVoices,
	ampModRate,
	ampModDepth,
	freqModRate,
	freqModDepth
}) => ({
	nodes: [
		...activeVoices.map(({note, velocity, id}) => (
			Osc({
				id,
				frequency: mtof(note),
				gain: 127 / velocity
			})
		)),
		Osc({
			id: 'ampMod',
			frequency: ampModRate,
			gain: ampModDepth
		}),
		Osc({
			id: 'freqMod',
			frequency: freqModRate,
			gain: freqModDepth
		})
	],
	connections: activeVoices.reduce((connections, {id}) => {
		return connections.concat([
			['freqMod', `${id}.detune`],
			['ampMod', `${id}.gain`],
			[id, tilda.OUTPUT]
		]);
	}, [])
});

const synth = Synth(state);

console.log(JSON.stringify(synth, null, 4))


// const ctx = new AudioContext();

// // Composition and output
// Tilda.render(
// 	{
// 		nodes: state.oscillators.map(Osc)
// 	},
// 	ctx.destination
// );

