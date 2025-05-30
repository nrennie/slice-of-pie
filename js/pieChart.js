function pieChart() {
  // Set the dimensions of the chart
  const width = config.settings.width;
  const height = config.settings.height;
  const margin = config.settings.margin;

  // Set up data
  const radius = Math.min(width, height) / 2 - margin;
  const n = d3.randomInt(config.data.minN, config.data.maxN)();
  const data = generateData(n, config.data.min, config.data.max);
  const pie = d3.pie().value((d) => d.value);
  const pieData = pie(
    Object.entries(data).map(([key, value]) => ({ key, value }))
  );
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  var percentA = ((data["a"] / total) * 100).toFixed(0);

  // Set the color scale
  const colPalette = config.style.colPalette;
  const highlightCol = config.style.highlightCol;
  const shuffled = d3.shuffle(colPalette);
  const needed = n - 1;
  let baseCols = shuffled.slice(0, Math.min(needed, shuffled.length));
  if (baseCols.length < needed) {
    const interpolated = d3.range(needed).map((i) => {
      const t = i / (needed - 1);
      return d3.interpolateRgbBasis(baseCols)(t);
    });
    baseCols = interpolated;
  }
  const newPalette = [highlightCol].concat(baseCols);
  const color = d3.scaleOrdinal().domain(Object.keys(data)).range(newPalette);

  // Select the chart container and clear any existing content
  const chartContainer = d3.select("#chart");
  chartContainer.selectAll("svg").remove();

  // Create the SVG container for the new pie chart
  const svg = chartContainer
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .style("width", "100%")
    .style("height", "auto")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Plot helper functions
  const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);

  // Plot
  svg
    .selectAll("pie")
    .data(pieData)
    .enter()
    .append("path")
    .attr("d", (d) => arcGenerator(d))
    .attr("fill", (d) => color(d.data.key))
    .attr("stroke", "black")
    .style("stroke-width", "2px");

  svg
    .selectAll("pie")
    .data(pieData)
    .enter()
    .append("text")
    .text((d) => sentenceCase(d.data.key))
    .attr("transform", (d) => "translate(" + arcGenerator.centroid(d) + ")")
    .style("text-anchor", "middle")
    .style("font-size", 30);

  return percentA;
}

window.onload = function () {
  const targetValue = pieChart();
  setupSlider(targetValue);
};
