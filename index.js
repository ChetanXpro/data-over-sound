// Here we will convert our text to binary
const textToBinary = (text) => {
  return text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join("");
};

// Here we will generate the tone for the data
function generateToneForData(data) {
  const bits = data.split("");

  console.log(bits);
}

const resp = textToBinary("How are you");

generateToneForData(resp);
