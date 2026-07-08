import React, { useState } from "react";
import { GitBranch, Database, Shield, Cpu, Activity, Server } from "lucide-react";

export default function ArchitectureDiagram() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const nodes = [
    { id: "client", label: "Airtel/Safaricom client USSD", desc: "User entry point via KE USSD AI Gateway endpoints", color: "stroke-terminal-green", fill: "fill-terminal-green/5", icon: Cpu },
    { id: "gateway", label: "Zero-Trust API Gateway", desc: "Token authentication, rate limit locks, and schema security verification", color: "stroke-terminal-cyan", fill: "fill-terminal-cyan/5", icon: Shield },
    { id: "service", label: "FastAPI Backend Core", desc: "Microservices coordinate diagnosis lookups and veterinary RAG lookups", color: "stroke-purple-400", fill: "fill-purple-950/5", icon: Server },
    { id: "vector", label: "PostgreSQL & pgvector DB", desc: "Vector store indexes medical diagnostics and safety records securely", color: "stroke-amber-400", fill: "fill-amber-950/5", icon: Database },
  ];

  return (
    <div className="w-full bg-terminal-card border border-terminal-cyan/20 rounded-lg p-4 font-mono">
      {/* SVG Canvas */}
      <div className="relative overflow-x-auto select-none">
        <svg
          viewBox="0 0 800 240"
          className="w-full min-w-[700px] h-[200px]"
        >
          {/* Arrow markers */}
          <defs>
            <marker
              id="arrow-green"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#00ff9f" />
            </marker>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#00e5ff" />
            </marker>
            <marker
              id="arrow-purple"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 2 L 8 5 L 0 8 z" fill="#a78bfa" />
            </marker>
          </defs>

          {/* Connection vectors */}
          {/* Client to Gateway */}
          <path
            d="M 160 120 L 255 120"
            className="stroke-terminal-green stroke-[1.5] fill-none"
            markerEnd="url(#arrow-green)"
          />
          {/* Gateway to Service */}
          <path
            d="M 390 120 L 485 120"
            className="stroke-terminal-cyan stroke-[1.5] fill-none"
            markerEnd="url(#arrow-cyan)"
          />
          {/* Service to Database */}
          <path
            d="M 620 120 L 715 120"
            className="stroke-purple-400 stroke-[1.5] fill-none"
            markerEnd="url(#arrow-purple)"
          />

          {/* Nodes */}
          {/* Client Node */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredNode("client")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect x="30" y="80" width="130" height="80" rx="6" className="stroke-terminal-green stroke-2 fill-black/60 group-hover:fill-terminal-green/5 transition-colors" />
            <text x="95" y="115" className="fill-terminal-green text-[10px] font-bold text-center" textAnchor="middle">USSD_CLIENT</text>
            <text x="95" y="135" className="fill-terminal-text text-[9px]" textAnchor="middle">Safaricom / Airtel</text>
          </g>

          {/* Gateway Node */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredNode("gateway")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect x="260" y="80" width="130" height="80" rx="6" className="stroke-terminal-cyan stroke-2 fill-black/60 group-hover:fill-terminal-cyan/5 transition-colors" />
            <text x="325" y="115" className="fill-terminal-cyan text-[10px] font-bold" textAnchor="middle">API_GATEWAY</text>
            <text x="325" y="135" className="fill-terminal-text text-[9px]" textAnchor="middle">Zero-Trust Moat</text>
          </g>

          {/* Service Node */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredNode("service")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect x="490" y="80" width="130" height="80" rx="6" className="stroke-purple-400 stroke-2 fill-black/60 group-hover:fill-purple-400/5 transition-colors" />
            <text x="555" y="115" className="fill-purple-400 text-[10px] font-bold" textAnchor="middle">FASTAPI_BACKEND</text>
            <text x="555" y="135" className="fill-terminal-text text-[9px]" textAnchor="middle">RAG Orchestrator</text>
          </g>

          {/* Database Node */}
          <g
            className="cursor-pointer group"
            onMouseEnter={() => setHoveredNode("vector")}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <rect x="720" y="80" width="70" height="80" rx="6" className="stroke-amber-400 stroke-2 fill-black/60 group-hover:fill-amber-400/5 transition-colors" />
            <text x="755" y="115" className="fill-amber-400 text-[10px] font-bold" textAnchor="middle">PG_DB</text>
            <text x="755" y="135" className="fill-terminal-text text-[9px]" textAnchor="middle">Vector St.</text>
          </g>
        </svg>
      </div>

      {/* Info readout display panel */}
      <div className="mt-3 min-h-[60px] bg-black/50 border border-terminal-green/10 p-3 rounded text-[10px] leading-relaxed text-terminal-text/80">
        {hoveredNode ? (
          <div>
            <span className="font-bold text-white uppercase tracking-wider">
              {nodes.find((n) => n.id === hoveredNode)?.label}
            </span>
            <p className="mt-1 text-terminal-cyan">
              {nodes.find((n) => n.id === hoveredNode)?.desc}
            </p>
          </div>
        ) : (
          <div className="text-terminal-muted italic">
            * Hover or tap architectural node structures to view socket specifications...
          </div>
        )}
      </div>
    </div>
  );
}
