const wav = require("wav");
const fs = require("fs");

// Here we will convert our text to binary
const textToBinary = (text) => {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
};

// Frequencies for binary '0' and '1'
const FREQ_ZERO = 1000;
const FREQ_ONE = 2000;

// this is standard CD quality sample rate
const SAMPLE_RATE = 44100;

// this is the duration for which we will play each bit
const BIT_DURATION = 0.1;

function generateToneForBit(bit) {
  // as our bit duration is 0.1 sec , we have to calculate the number of samples for 0.1 sec
  const numSamples = SAMPLE_RATE * BIT_DURATION;

  // 2 bytes for each sample because each sample needs 16 bits of storage, and there are 8 bits in a byte.
  // hence the total buffer size must be numSamples * 2 bytes.
  // We are using 16 bit buffer coz its provide a good balance between quality and size
  const toneBuffer = Buffer.alloc(numSamples * 2);

  // here we are checking if the bit is 0 or 1 and assigning the frequency accordingly
  const frequency = bit === "0" ? FREQ_ZERO : FREQ_ONE;

  // Generate the tone for the bit

  for (let i = 0; i < numSamples; i++) {
    // calculate the time at which each sample is taken
    const time = i / SAMPLE_RATE;

    // here we are calculating the sample curve
    const sample = Math.sin(2 * Math.PI * frequency * time);
    // convert to 16-bit integer
    const intVal = Math.round(sample * 32767);

    // Here we are writing the sample to the buffer as a 16-bit integer
    toneBuffer.writeInt16LE(intVal, i * 2);
  }

  return toneBuffer;
}

const generateToneForData = (binary) => {
  const bits = binary.split("");
  // this will return buffer for each bit
  const toneBuffers = bits.map(generateToneForBit);
  console.log(toneBuffers);
  return Buffer.concat(toneBuffers);
};

const textBinary = textToBinary("How are you");

const audioBuffer = generateToneForData(textBinary);

const writer = new wav.Writer({
  channels: 1,
  sampleRate: SAMPLE_RATE,
  bitDepth: 16,
});

writer.pipe(fs.createWriteStream("sample.wav"));

writer.write(audioBuffer);

writer.end();
