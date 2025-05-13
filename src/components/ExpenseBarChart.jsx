
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const ExpenseBarChart = ({ data }) => {
  const svgRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const container = containerRef.current;
    const width = container?.clientWidth || 600;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 60, left: 60 };

    // Clear previous chart
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const sortedData = [...data].sort((a, b) => b.amount - a.amount);

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.amount) * 1.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    // Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .clone()
        .attr("x2", width - margin.left - margin.right)
        .attr("stroke-opacity", 0.1));

    // Bars
    svg.append("g")
      .selectAll("rect")
      .data(sortedData)
      .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.amount))
      .attr("height", d => y(0) - y(d.amount))
      .attr("width", x.bandwidth())
      .attr("fill", "#4F46E5")
      .attr("rx", 4)
      .attr("ry", 4);

    // Labels
    svg.append("g")
      .selectAll("text.label")
      .data(sortedData)
      .join("text")
      .attr("class", "label")
      .attr("x", d => x(d.category) + x.bandwidth() / 2)
      .attr("y", d => y(d.amount) - 5)
      .attr("text-anchor", "middle")
      .text(d => `$${d.amount.toLocaleString()}`)
      .style("font-size", "12px")
      .style("fill", "#4B5563");

    // Cleanup on unmount
    return () => {
      svg.selectAll("*").remove();
    };
  }, [data]);

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full h-96"></svg>
    </div>
  );
};

export default ExpenseBarChart;
