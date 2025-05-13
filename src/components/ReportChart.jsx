import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const COLORS = ["#00C49F", "#FF8042", "#8884d8", "#FFBB28"];

const ReportChart = ({ transactions }) => {
  const ref = useRef();

  useEffect(() => {
    // Group data by category
    const grouped = transactions.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
      return acc;
    }, {});

    const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

    // Set up SVG
    const width = 400;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    d3.select(ref.current).selectAll('*').remove(); // Clear old content
    const svg = d3.select(ref.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create pie layout
    const pie = d3.pie().value(d => d.value);
    const arcs = pie(data);

    // Create arc generator
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius - 10);

    // Draw slices
    svg.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (_, i) => COLORS[i % COLORS.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', '2');

    // Add labels
    const labelArc = d3.arc().innerRadius(0).outerRadius(radius);

    svg.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '12px')
      .text(d => d.data.name);

  }, [transactions]);

  return (
    <svg ref={ref}></svg>
  );
};

export default ReportChart;
