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
			id: '12012912912', // timestamp
			note: 69,
			velocity: 120
		},
		{
			id: '12012914002',
			note: 71,
			velocity: 98
		}
	],
	gainEnvelope: {
		attack: 2,
		decay: 300,
		sustain: 0.3,
		release: 2000
	},
	lfos: {
		lfo1: {
			frequency: 2,
			gain: 0.5
		},
		lfo2: {
			frequency: 6,
			gain: 20
		}
	}
};


// Component
const Osc = ({frequency, gain, ...otherProps}) => ({
	nodes: [
		{
			id: 'osc',
			NodeType: 'oscillator',
			type: 'sawtooth',
			frequency,
			connect: 'gain'
		},
		{
			id: 'gain',
			NodeType: 'gain',
			gain,
			connect: tilda.OUTPUT
		}
	],
	interface: {
		frequency: 'osc.frequency',
		detune: 'osc.detune',
		gain: 'gain.gain'
	},
	...otherProps
});

const Synth = ({
	activeVoices,
	gainEnvelope,
	lfos
}) => ({
	nodes: [
		...activeVoices.map(({note, velocity, id}) => (
			Osc({
				id,
				frequency: mtof(note),
				gain: 0,
				data: {velocity, ...gainEnvelope},
				connect: tilda.OUTPUT,
				...createEnvelopeLifeCycleMethods('gain')
			})
		)),
		Osc({
			id: 'lfo1',
			connect: activeVoices.map(({id}) => `${id}.gain`),
			...lfos.lfo1
		}),
		Osc({
			id: 'lfo2',
			connect: activeVoices.map(({id}) => `${id}.detune`),
			...lfos.lfo2
		})
	]
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

