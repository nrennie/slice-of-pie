// Function to convert string to sentence case
function sentenceCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Function to generate data
function generateData(n, min, max) {
  const data = {};
  for (let i = 0; i < n; i++) {
    const key = String.fromCharCode(97 + i);
    data[key] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return data;
}
