import React, { useRef, useEffect } from 'react';
import { select, scaleLinear, axisBottom, axisLeft, drag, event } from "d3";

const data = [
  {x: 200, y: 80, id: 1},
  {x: 700, y: 40, id: 2},
  {x: 300, y: 10, id: 3},
  {x: 900, y: 20, id: 4},
  {x: 1111, y: 30, id: 5},
  {x: 1920, y: 40, id: 6},
  {x: 2010, y: 50, id: 7},
  {x: 2060, y: 60, id: 8},
]

function App() {
  const rootRef = useRef<SVGSVGElement>(null); 
  const margin = ({top: 20, right: 30, bottom: 30, left: 40});
  const width = 600;
  const height = 600;

  const dragstarted = (d: any) => {
    console.log(d);
    // select(d).raise().classed('active', true);
  }

  const dragHandle = drag()
    // .on("start", dragstarted)
    .on("drag", (d: any) => console.log(d))
    // .on("end", console.log);

  useEffect(() => {
    const root = select(rootRef.current)
      .attr("viewBox", `0, 0, ${width}, ${height}`);
    
    const xScale = scaleLinear()
      .domain([200, 2080])
      .range([margin.left, width - margin.right])

    const yScale = scaleLinear()
      .domain([0, 90])
      .range([height - margin.bottom, margin.top])

    const xAxis = axisBottom(xScale)
      .ticks(12);

    const yAxis = axisLeft(yScale);

    root.append('g').attr("transform", `translate(${margin.left},0)`).call(yAxis);
    root.append('g').attr("transform", `translate(0,${height - margin.bottom})`).call(xAxis);

    const bars = root.selectAll('rect')
      .data(data)
      .enter().append('g')
    
      bars.append('rect').attr('x', d => xScale(d.x))
      .attr("id", d => "bar" + d.id)
      .attr('y', d => yScale(d.y))
      .attr("width", 42)
      .attr("height", function (d) {
        return height - margin.bottom - yScale(Number(d.y))
      });

      bars.append('rect')
        .style('fill', "steelblue")
        .attr("id", d => "drag" + d.id)
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y))
        .attr("width", 42)
        .attr("cursor", "ns-resize")
        .attr("height", function (d) {
          return 5
        })
        .call(drag().on('drag', (d: any) => {
          const oldY = yScale(d.y);
          const newY = yScale(event.y);
          const newHeight = height - margin.bottom - newY;
          console.log(event.y, newY, newHeight)
          
          select('#drag' + d.id)
            .attr("y", function(d: any) { return newY; })
            .attr("height", () => newHeight);
        }) as any);

    // root.selectAll('rect').call(dragHandle as any);
    // root.append("g")
    // .attr("fill", "steelblue")
    // .selectAll("rect")
    // .data(data)
    // .join("rect")
    //   .attr('x', data => data.x)
    //   .attr('y', data => data.y);

    // root.append('g').call(xAxis);
    // root.append('g').call(yAxis);
  })

  return (
    <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg style={{width: 650, height: 650}} ref={rootRef}></svg>
    </div>
  );
}

export default App;
