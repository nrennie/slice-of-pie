function setupSlider(targetValue) {
  const min = 0;
  const max = 100;
  const initialValue = 50;
  const step = 1;
  const tickStep = 10;

  const sliderWidth = 300;
  const tickHeight = 8;

  const container = d3
    .select("#sliderContainer")
    .style("position", "relative")
    .style("width", sliderWidth + "px");

  container.html("");

  // Create slider input
  container
    .append("input")
    .attr("type", "range")
    .attr("min", min)
    .attr("max", max)
    .attr("step", step)
    .attr("value", initialValue)
    .style("width", sliderWidth + "px")
    .attr("id", "slider");

  // Tick container: relative positioning so absolute ticks inside
  const ticksContainer = container
    .append("div")
    .style("position", "relative")
    .style("height", "30px")
    .style("margin-top", "6px");

  // Function to convert value to pixel position relative to slider width
  const valueToPosition = (val) => {
    const ratio = (val - min) / (max - min);
    return ratio * sliderWidth;
  };

  for (
    let val = Math.ceil(min / tickStep) * tickStep;
    val <= max;
    val += tickStep
  ) {
    const leftPos = valueToPosition(val);

    const tick = ticksContainer
      .append("div")
      .style("position", "absolute")
      .style("left", `${leftPos}px`)
      .style("transform", "translateX(-50%)")
      .style("text-align", "center")
      .style("user-select", "none")
      .style("font-size", "12px")
      .style("top", "0px")
      .style("width", "30px");

    tick
      .append("div")
      .style("width", "2px")
      .style("height", `${tickHeight}px`)
      .style("background-color", "black")
      .style("margin", "0 auto");

    tick
      .append("span")
      .text(val)
      .style("display", "block")
      .style("margin-top", "2px");
  }

  // Add selected value display *after* the ticks
  container
    .append("div")
    .attr("id", "selectedValue")
    .style("margin-top", "10px")
    .style("text-align", "center")
    .style("font-weight", "bold")
    .text(`You've selected: ${initialValue}%`);

  // Add event listener to update on slider input
  container.select("input[type=range]").on("input", function () {
    d3.select("#selectedValue").text(`You've selected: ${this.value}%`);
  });

  container
    .append("button")
    .text("Check Answer")
    .style("margin-top", "10px")
    .style("display", "block")
    .style("margin-left", "auto")
    .style("margin-right", "auto");

  container
    .append("div")
    .attr("id", "feedback")
    .style("margin-top", "10px")
    .style("text-align", "center")
    .style("font-style", "italic");

  const button = d3.select("#sliderContainer button");

  button.on("click", function () {
    const guess = +d3.select("#slider").node().value;
    const diff = Math.abs(guess - targetValue);

    let message;
    if (diff === 0) {
      message = `Spot on! The answer is ${targetValue}%`;
    } else if (diff <= 5) {
      message = `Very close! The answer is ${targetValue}%`;
    } else if (diff <= 15) {
      message = `Not too far. The answer is ${targetValue}%`;
    } else {
      message = `Way off! The answer is ${targetValue}%`;
    }

    d3.select("#feedback").text(message);
    button.text("Try again");

    // Delay rebinding the event to avoid interrupting this one
    setTimeout(() => {
      button.on("click", () => location.reload());
    }, 0);
  });
}
