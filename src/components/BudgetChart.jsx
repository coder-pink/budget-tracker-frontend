import { useEffect, useRef } from "react";
import * as d3 from "d3";

const BudgetChart = ({ budget, expenses }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = [
      { label: "Budget", value: budget },
      { label: "Expenses", value: expenses }
    ];

    const width = 400;
    const height = 300;
    const margin = { top: 30, right: 20, bottom: 40, left: 50 };

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.4);

    const y = d3
      .scaleLinear()
      .domain([0, Math.max(budget, expenses) * 1.1])
      .range([height - margin.bottom, margin.top]);

    const xAxis = g =>
      g.attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    const yAxis = g =>
      g.attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(5));

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);

    svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.label))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth())
      .attr("fill", d => d.label === "Expenses" ? "#EF4444" : "#10B981"); // red or green
  }, [budget, expenses]);

  return <svg ref={svgRef} width={400} height={300}></svg>;
};

export default BudgetChart;
