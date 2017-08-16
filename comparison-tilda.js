// Tilda
//------------------

const memoize = require('lodash/memoize');

const tilda = {
	// Constant for output of a component
	OUTPUT: 'OUTPUT'
};
// TODO: add midiToFrequency fn
const mtof = (note) => note;
const createEnvelopeLifeCycleMethods = memoize((param) => ({
	componentDidMount: (node, props) => {
		const now = node.audioContext.currentTime;
		const {attack, decay, sustain, velocity = 127, max = 1} = props.data;
		const scale = velocity / 127;

		node[param].setTargetAtTime(max * scale, now + attack);
		node[param].setTargetAtTime(sustain * scale, now + attack + decay);
	},
	componentWillUnmount: (node, props, destroyNode) => {
		const now = node.audioContext.currentTime;
		const {release, min = 0} = props.data;

		node[param].setTargetAtTime(min, now + release);
		setTimeout(destroyNode, release + 20);
	}
}));

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
	attack: 2,
	decay: 300,
	sustain: 0.3,
	release: 2000,
	ampModRate: 2,
	ampModDepth: 0.5,
	freqModRate: 6,
	freqModDepth: 20
};


// Component
const Osc = ({frequency, gain, ...otherProps}) => ({
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
	input: 'osc',
	...otherProps
});

const Synth = ({
	activeVoices,
	ampModRate,
	ampModDepth,
	freqModRate,
	freqModDepth,
	attack,
	decay,
	sustain,
	release
}) => ({
	nodes: [
		...activeVoices.map(({note, velocity, id}) => (
			Osc({
				id,
				frequency: mtof(note),
				gain: 0,
				data: {velocity, attack, decay, sustain, release},
				// TODO: Osc input is an oscillator. Think of interface for this.
				...createEnvelopeLifeCycleMethods('gain')
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

console.log(JSON.stringify(synth, null, 4));


// const ctx = new AudioContext();

// // Composition and output
// Tilda.render(
// 	{
// 		nodes: state.oscillators.map(Osc)
// 	},
// 	ctx.destination
// );

