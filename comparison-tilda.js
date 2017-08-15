// Tilda
//------------------


const tilda = {
	OUTPUT: 'OUTPUT'
}
const mtof = (note) => note;

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
const Osc = ({frequency, gain}) => ({
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

const LFO = ({frequency, gain}) => ({
	nodes: [
		{
			id: 'osc',
			NodeType: 'oscillator',
			type: 'sine',
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
	]
})

const activeVoices = [
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
]

const Synth = ({
	activeVoices,
	ampModRate,
	ampModDepth,
	freqModRate,
	freqModDepth
}) => ({
	nodes: [
		...activeVoices.map(({note, velocity, id}) => ({
			id,
			...Osc({
				frequency: mtof(note),
				gain: 127 / velocity
			})
		})),
		{
			id: 'ampMod',
			...LFO({
				frequency: ampModRate,
				gain: ampModDepth
			})
		},
		{
			id: 'freqMod',
			...LFO({
				frequency: freqModRate,
				gain: freqModDepth
			})
		}
	],
	connections: activeVoices.reduce((connections, {id}) => {
		return connections.concat([
			['freqMod', `${id}.detune`],
			['ampMod', `${id}.gain`],
			[id, tilda.OUTPUT]
		]);
	}, [])
});

const synth = Synth({
	activeVoices,
	ampModRate: 2,
	ampModDepth: 0.5,
	freqModRate: 6,
	freqModDepth: 2 / 12 // 2 semitones
});

console.log(JSON.stringify(synth, null, 4))


// const ctx = new AudioContext();

// // Composition and output
// Tilda.render(
// 	{
// 		nodes: state.oscillators.map(Osc)
// 	},
// 	ctx.destination
// );

