export const TAGS = [
  'crickets',
  'fan',
  'fire',
  'noise',
  'ocean',
  'rain',
  'river',
  'stream',
  'water',
];

export const MIX_LIMIT = 5;

export const NOISE_COLOR = ['brown', 'pink', 'white'];

export const FREQ = {
  default: 8000,
  min: 0,
  max: 15000,
  step: 1,
};

export const VOLUME = {
  default: 0,
  min: -80,
  max: 0,
  step: 1,
};

export const ACRN = {
  type: { tone: 'tone', sequence: 'seq', synthesizer: 'synth' },
  sequence: {
    loopRepeat: 4,
    restLength: 4,
  },
};

export const DEBOUNCE_WAIT = 500;

export const MAX_FILE_SIZE_BYTES = 1000000;
