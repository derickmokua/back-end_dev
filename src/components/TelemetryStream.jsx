import React, { useEffect, useState, useRef } from "react";
import { Terminal, Shield } from "lucide-react";

export default function TelemetryStream() {
  const [logs, setLogs] = useState([]);
  const logIndexRef = useRef(0);
  const containerRef = useRef(null);

  const mockLogTemplates = [
    { source: "SECURE", status: "SUCCESS", message: "Zero-Trust signature token validation passed (client_uuid=8fa2)" },
    { source: "AI_CORE", status: "OK", message: "Evaluating Gemini generation for hallucination risk... score=0.012 (thresh<0.05)" },
    { source: "DB_POOL", status: "INFO", message: "Active DB connections: 12/50. Pool efficiency = 98.4%" },
    { source: "RATE_LIMIT", status: "OK", message: "Airtel USSD Gateway KE rate limits check OK (requests=4/min, quota=60)" },
    { source: "SECURE", status: "WARNING", message: "Blocked connection attempt to Postgres from unauthorized subnet 192.168.12.4" },
    { source: "AI_CORE", status: "SUCCESS", message: "RAG pipeline search matched 3 vector chunks for: 'avian Newcastle disease'" },
    { source: "USSD_GATE", status: "OK", message: "Received session command: *384*482# from Airtel MSISDN=254716***375" },
    { source: "DB_POOL", status: "INFO", message: "Postgres schema row-level security policy checked for veterinary_diagnostics" },
    { source: "SECURE", status: "SUCCESS", message: "Rotated Redis system tokens securely in VPC vault" },
    { source: "AI_CORE", status: "OK", message: "Gemini safety metrics checked (Harassment: NEGLIGIBLE, Dangerous Content: NEGLIGIBLE)" }
  ];

  useEffect(() => {
    // Generate initial set of logs
    const initialLogs = Array.from({ length: 8 }).map((_, idx) => {
      const template = mockLogTemplates[idx % mockLogTemplates.length];
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      return {
        id: idx,
        timestamp: timeStr,
        source: template.source,
        status: template.status,
        message: template.message
      };
    });
    setLogs(initialLogs);
    logIndexRef.current = 8;

    // Simulate logs stream
    const interval = setInterval(() => {
      setLogs((next) => {
        const template = mockLogTemplates[Math.floor(Math.random() * mockLogTemplates.length)];
        const now = new Date();
        const timeStr = now.toTimeString().split(" ")[0];
        const newLog = {
          id: logIndexRef.current++,
          timestamp: timeStr,
          source: template.source,
          status: template.status,
          message: template.message
        };
        // Keep last 40 logs to prevent memory bloat
        return [...next, newLog].slice(-40);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getSourceStyles = (source) => {
    switch (source) {
      case "SECURE": return "text-terminal-green bg-terminal-green/10 border-terminal-green/20";
      case "AI_CORE": return "text-purple-400 bg-purple-950/20 border-purple-500/20";
      case "DB_POOL": return "text-terminal-cyan bg-terminal-cyan/10 border-terminal-cyan/20";
      case "RATE_LIMIT": return "text-amber-400 bg-amber-950/20 border-amber-500/20";
      default: return "text-pink-400 bg-pink-950/20 border-pink-500/20";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "SUCCESS": return "text-terminal-green";
      case "WARNING": return "text-red-400 animate-pulse font-bold";
      case "INFO": return "text-terminal-cyan";
      default: return "text-terminal-text";
    }
  };

  return (
    <div className="w-full bg-terminal-card border border-terminal-green/20 rounded-lg overflow-hidden glow-border-green shadow-lg flex flex-col font-mono text-xs">
      {/* Header bar */}
      <div className="bg-black/80 px-4 py-2 border-b border-terminal-green/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-terminal-green animate-pulse" />
          <span className="font-bold text-terminal-green">LIVE_TELEMETRY_LOGS</span>
        </div>
        <span className="text-[10px] text-terminal-muted flex items-center gap-1">
          <Shield size={10} className="text-terminal-cyan" />
          VPC_STREAM: LOGGING_ENABLED
        </span>
      </div>

      {/* Log Feed */}
      <div
        ref={containerRef}
        className="p-3 bg-black/40 h-[220px] overflow-y-auto space-y-2.5 scrollbar-thin scrollbar-thumb-terminal-green/20"
      >
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col sm:flex-row sm:items-center gap-1.5 leading-relaxed text-[11px]">
            {/* Timestamp */}
            <span className="text-terminal-muted/60 flex-shrink-0">
              [{log.timestamp}]
            </span>

            {/* Source Module */}
            <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold text-center min-w-[75px] inline-block ${getSourceStyles(log.source)}`}>
              {log.source}
            </span>

            {/* Message Body */}
            <span className="text-terminal-text break-all sm:break-normal flex-1">
              {log.message}
            </span>

            {/* Status Flag */}
            <span className={`text-[10px] font-bold sm:ml-auto flex-shrink-0 ${getStatusStyles(log.status)}`}>
              [{log.status}]
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
