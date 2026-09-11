import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface TreeMapData {
  name: string;
  value?: number;
  children?: TreeMapData[];
}

const MOCK_DATA: TreeMapData = {
  name: "root",
  children: [
    { name: "/var", children: [
        { name: "log (System Logs)", value: 4500 },
        { name: "lib (Docker, VM data)", value: 12000 },
        { name: "cache (Package Cache)", value: 2100 }
    ]},
    { name: "/usr", children: [
        { name: "share (Assets)", value: 3200 },
        { name: "bin (Binaries)", value: 1500 },
        { name: "lib (Libraries)", value: 5400 }
    ]},
    { name: "/home", children: [
        { name: "user_governance", value: 8500 },
        { name: "admin_assets", value: 4200 }
    ]},
    { name: "/opt", children: [
        { name: "legalsynopsis_core", value: 6300 },
        { name: "n8n_modules", value: 1800 }
    ]},
    { name: "/tmp", children: [
        { name: "orphaned_builds", value: 3100 },
        { name: "session_cache", value: 900 }
    ]}
  ]
};

const COLORS = ['#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

export function DiskHeatmap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !svgRef.current || !tooltipRef.current) return;

    const renderChart = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = 300;

      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove(); 
      svg.attr("viewBox", [0, 0, width, height]);

      const root = d3.hierarchy<TreeMapData>(MOCK_DATA)
          .sum(d => d.value || 0)
          .sort((a, b) => (b.value || 0) - (a.value || 0)) as d3.HierarchyRectangularNode<TreeMapData>;

      d3.treemap<TreeMapData>()
          .size([width, height])
          .paddingInner(3)
          .paddingOuter(3)
          .paddingTop(20)
          .round(true)(root);

      const colorScale = d3.scaleOrdinal(COLORS);

      // Draw parent categories (folders)
      const nodes = svg.selectAll("g")
        .data(root.descendants().filter(d => d.depth > 0))
        .join("g")
          .attr("transform", d => `translate(${d.x0},${d.y0})`);

      nodes.append("rect")
          .attr("fill", d => {
            if (d.depth === 1) return '#161b22'; // Parent background
            let current = d;
            while (current.depth > 1) {
              current = current.parent!;
            }
            return colorScale(current.data.name);
          })
          .attr("fill-opacity", d => d.depth === 1 ? 1 : 0.8)
          .attr("stroke", d => d.depth === 1 ? "#30363d" : "none")
          .attr("stroke-width", d => d.depth === 1 ? 1 : 0)
          .attr("width", d => Math.max(0, d.x1 - d.x0))
          .attr("height", d => Math.max(0, d.y1 - d.y0))
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("class", d => d.depth > 1 ? "cursor-pointer transition-opacity duration-200" : "")
          .on("mouseover", function(event, d) {
            if (d.depth > 1) {
              d3.select(this).attr("fill-opacity", 1);
              
              const tooltip = d3.select(tooltipRef.current);
              tooltip.transition().duration(200).style("opacity", 1);
              
              const val = d.value || 0;
              const formattedVal = val > 1000 ? (val/1000).toFixed(1) + ' GB' : val + ' MB';
              
              tooltip.html(`
                <div class="font-semibold text-slate-900 dark:text-[#c9d1d9] mb-1">${d.data.name}</div>
                <div class="text-slate-500 dark:text-[#8b949e] text-xs">Size: <span class="text-white">${formattedVal}</span></div>
                <div class="text-slate-500 dark:text-[#8b949e] text-xs">Path: ${d.parent?.data.name}/${d.data.name}</div>
              `)
              .style("left", (event.pageX + 15) + "px")
              .style("top", (event.pageY - 28) + "px");
            }
          })
          .on("mouseout", function(event, d) {
            if (d.depth > 1) {
              d3.select(this).attr("fill-opacity", 0.8);
              d3.select(tooltipRef.current).transition().duration(500).style("opacity", 0);
            }
          });

      // Add parent labels
      svg.selectAll("text.parent-label")
        .data(root.descendants().filter(d => d.depth === 1))
        .join("text")
          .attr("class", "parent-label pointer-events-none")
          .attr("x", d => d.x0 + 6)
          .attr("y", d => d.y0 + 14)
          .attr("fill", "#8b949e")
          .attr("font-size", "10px")
          .attr("font-weight", "600")
          .attr("font-family", "monospace")
          .text(d => d.data.name);

      // Add child labels (only if box is big enough)
      const childLabels = svg.selectAll("text.child-label")
        .data(root.leaves())
        .join("text")
          .attr("class", "child-label pointer-events-none")
          .attr("x", d => d.x0 + 6)
          .attr("y", d => d.y0 + 16)
          .attr("fill", "#ffffff")
          .attr("font-size", "11px")
          .attr("font-family", "sans-serif")
          .attr("font-weight", "500");
          
      childLabels.append("tspan")
          .text(d => {
            const width = d.x1 - d.x0;
            return width > 60 ? (d.data.name.length > 12 ? d.data.name.slice(0,10)+'...' : d.data.name) : "";
          });
          
      childLabels.append("tspan")
          .attr("x", d => d.x0 + 6)
          .attr("y", d => d.y0 + 30)
          .attr("fill", "rgba(255,255,255,0.7)")
          .attr("font-size", "9px")
          .text(d => {
            const width = d.x1 - d.x0;
            const height = d.y1 - d.y0;
            const val = d.value || 0;
            const formattedVal = val > 1000 ? (val/1000).toFixed(1) + ' GB' : val + ' MB';
            return (width > 60 && height > 35) ? formattedVal : "";
          });
    };

    renderChart();

    const resizeObserver = new ResizeObserver(() => {
      renderChart();
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div ref={containerRef} className="w-full flex-1 min-h-[300px]">
        <svg ref={svgRef} className="w-full h-full block" />
      </div>
      <div 
        ref={tooltipRef} 
        className="fixed pointer-events-none opacity-0 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-[#30363d] p-3 rounded-lg shadow-2xl z-[100] transition-opacity duration-200 min-w-[150px]"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
