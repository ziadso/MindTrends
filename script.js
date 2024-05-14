document.addEventListener("DOMContentLoaded", function() {
    // Fetch data from the Express server API endpoint
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const svgWidth = 600, svgHeight = 400;
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };
            const width = svgWidth - margin.left - margin.right;
            const height = svgHeight - margin.top - margin.bottom;

            const svg = d3.select("#chart").append("svg")
                .attr("width", svgWidth)
                .attr("height", svgHeight)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            const colorScale = d3.scaleSequential().domain([0, 0.4]).interpolator(d3.interpolateBlues);
            const x = d3.scaleBand().range([0, width]).padding(0.1);
            const y = d3.scaleLinear().range([height, 0]).domain([0, 0.4]);

            const yAxis = d3.axisLeft(y).tickFormat(d3.format(".0%")).tickValues(d3.range(0, 0.41, 0.05));

            const tooltip = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden")
                .style("padding", "10px")
                .style("background", "white")
                .style("border", "1px solid #000")
                .style("border-radius", "5px");

            function updateChart(year) {
                const selectedYear = year || document.getElementById('year').value;
                document.getElementById('year-value').textContent = selectedYear;
                const visibleConditions = Array.from(document.querySelectorAll(".filter-conditions input:checked"), input => input.value);
                const updatedData = data[selectedYear].filter(d => visibleConditions.includes(d.condition));

                x.domain(updatedData.map(d => d.condition));
                y.domain([0, 0.4]);  // Keeping the domain constant

                svg.selectAll(".bar").remove();
                svg.selectAll(".x.axis").remove();
                svg.selectAll(".y.axis").remove();

                svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
                svg.append("g").attr("class", "y axis").call(yAxis);

                svg.selectAll(".bar").data(updatedData).enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", d => x(d.condition))
                    .attr("width", x.bandwidth())
                    .attr("y", d => y(d.prevalence))
                    .attr("height", d => height - y(d.prevalence))
                    .attr("fill", d => colorScale(d.prevalence))
                    .on("mouseover", function(event, d) {
                        tooltip.html(generateTooltipContent(d.condition, selectedYear, d.prevalence))
                            .style("visibility", "visible")
                            .style("top", (event.pageY - 10) + "px")
                            .style("left",(event.pageX + 10) + "px");
                    })
                    .on("mousemove", function(event) {
                        tooltip.style("top", (event.pageY - 10) + "px")
                            .style("left",(event.pageX + 10) + "px");
                    })
                    .on("mouseout", function() {
                        tooltip.style("visibility", "hidden");
                    });

                function generateTooltipContent(condition, year, prevalence) {
                    var content = `<strong>${condition}</strong>: ${Math.round(prevalence * 100)}% of the population in Germany have ${condition}`;
                    if (year > 2020) {
                        var prevYear = year - 1;
                        var prevData = data[prevYear].find(d => d.condition === condition).prevalence;
                        var diff = prevalence - prevData;
                        var diffPercentage = Math.round(diff * 100);
                        var change = diffPercentage > 0 ? "increased" : "decreased";
                        content += `, this percentage has ${change} by ${Math.abs(diffPercentage)}% from the previous year`;
                    }
                    return content;
                }
            }

            // Initial chart display
            updateChart('2020');

            // Event listeners for year slider and checkboxes
            document.getElementById('year').addEventListener("input", function() { updateChart(this.value); });
            document.querySelectorAll(".filter-conditions input").forEach(input => {
                input.addEventListener("change", () => updateChart());
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
