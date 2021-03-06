BarChart = React.createClass({
  componentDidMount() {
    var el = this.getDOMNode();
    var svg = d3.select(el)
            .append("svg")
            .attr("width", this.props.width)
            .attr("height", this.props.height);

    this.updateChart(this.props);
  },

  componentWillUpdate(nextProps) {
    this.updateChart(nextProps);
  },

  getDefaultProps() {
    return {
      width: 640,
      height: 480,
      max: 480
    };
  },

  updateChart(props) {
    var data = props.data;
    var max = _.max(_.pluck(data, "totalWorkload"));
    if (max < 0) {
      max = props.max;
    }
    // set scale
    var yScale = d3.scale.linear()
               .domain([0, max])
               .range([0, props.height - 35]);
    var xScale = d3.scale.ordinal()
               .domain(d3.range(data.length))
               .rangeRoundBands([0, props.width], 0.05);

    var svg = d3.select("svg");
    svg.append("linearGradient")
        .attr("id", "color-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", yScale(max * 0.2))
        .attr("x2", 0).attr("y2", yScale(max * 0.8))
        .selectAll("stop")
        .data([
          {offset: "0%", color: "#5192f5"},
          {offset: "30%", color: "#5e9af4"},
          {offset: "100%", color: "#315893"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    var bars = svg.selectAll("rect").data(data);
    bars.enter()
        .append("rect")
        .attr("class", "bars");

    bars.transition()
        .duration(1000)
        .attr("x", function(d, i) {
          return xScale(i);
        })
        .attr("y", function(d, i) {
          return props.height - yScale(d.totalWorkload) - 20;
        })
        .attr("width", xScale.rangeBand())
        .attr("height", function(d, i) {
          return yScale(d.totalWorkload);
        });

    bars.exit()
        .remove();

    var workLoadLabel = svg.selectAll(".workLoadLabel").data(data);
    workLoadLabel.enter()
        .append("text")
        .attr("class", "workLoadLabel")
        .attr("fill", "#aaa")
        .attr("text-anchor", "middle");

    workLoadLabel.transition()
        .duration(1000)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand()/2;
        })
        .attr("y", function(d, i) {
          return props.height - yScale(d.totalWorkload) - 25;
        })
        .text(function(d, i) {
          return d.totalWorkload;
        });

    workLoadLabel.exit()
        .remove();

    var weightLabel = svg.selectAll(".weightLabel").data(data);
    weightLabel.enter()
        .append("text")
        .attr("class", "weightLabel")
        .attr("fill", "#444")
        .attr("text-anchor", "middle");

    weightLabel.transition()
        .duration(1000)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand()/2;
        })
        .attr("y", function(d, i) {
          return props.height - yScale(d.totalWorkload);
        })
        .text(function(d, i) {
          return d.weight;
        });

    weightLabel.exit()
        .remove();

    var repLabel = svg.selectAll(".repLabel").data(data);
    repLabel.enter()
        .append("text")
        .attr("class", "repLabel")
        .attr("fill", "#fff")
        .attr("text-anchor", "middle");

        repLabel.transition()
        .duration(1000)
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand()/2;
        })
        .attr("y", function(d, i) {
          return props.height - yScale(d.totalWorkload) + 25;
        })
        .text(function(d, i) {
          return d.numReps;
        });

    repLabel.exit()
        .remove();

    var xLabel = svg.selectAll(".xLabel").data(data);
    xLabel.enter()
        .append("text")
        .attr("class", "xLabel")
        .attr("fill", "#aaa");

    xLabel.text(function(d, i) {
          return d.date;
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d, i) {
          return xScale(i) + xScale.rangeBand()/2;
        })
        .attr("y", function(d, i) {
          return props.height - 5;
        });

    xLabel.exit()
        .remove();
  },

  render() {
    return (
      <div className="chart"></div>
    );
  }
});
