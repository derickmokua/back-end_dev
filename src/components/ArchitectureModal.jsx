import React, { useState } from 'react';
import { X, Shield, Cpu, Database, Network, ArrowRight, Layers } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const pipeline = [
    {
      id: 'ingress',
      title: '1. Ingress Layer',
      tech: 'USSD Gateway / WebSockets / HTTPS',
      icon: <Network className="text-terminal-cyan" size={20} />,
      summary: 'Low-bandwidth multi-channel ingress designed for offline-first agricultural telemetry and high-concurrency mobile queries.',
      details: [
        'GSM/USSD session management with sub-second latency targets',
        'TLS 1.3 termination with strict HSTS and IP rate-limiting',
        'Adaptive payload compression for 2G/3G network conditions'
      ]
    },
    {
      id: 'auth',
      title: '2. Zero-Trust Security Gateway',
      tech: 'FastAPI / JWT / mTLS / HMAC',
      icon: <Shield className="text-terminal-green" size={20} />,
      summary: 'Perimeter-less identity validation enforcing least-privilege token verification before requests touch model execution pipelines.',
      details: [
        'Stateless JWT rotation paired with Redis revocations',
        'Cryptographic HMAC request payload signature checks',
        'Automated anomaly & prompt injection detection filter'
      ]
    },
    {
      id: 'rag',
      title: '3. Deterministic AI / RAG Pipeline',
      tech: 'Gemini API / ChromaDB / Vector Search',
      icon: <Cpu className="text-terminal-cyan" size={20} />,
      summary: 'Structured knowledge retrieval over veterinary datasets to eradicate hallucinations in agricultural disease diagnostics.',
      details: [
        'Embedding search with strict confidence scoring thresholds',
        'Dynamic grounding with localized veterinary advisory manuals',
        'Deterministic output validation to eliminate harmful false diagnoses'
      ]
    },
    {
      id: 'storage',
      title: '4. Persistence & Audit Layer',
      tech: 'PostgreSQL / TimescaleDB / WAL',
      icon: <Database className="text-terminal-green" size={20} />,
      summary: 'ACID-compliant storage partitioned by sensor telemetry and audit-logged diagnostic transactions.',
      details: [
        'High-write throughput connection pooling via PgBouncer',
        'Encrypted-at-rest database clusters with automatic read replicas',
        'Full tamper-evident audit logging for veterinary health histories'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-terminal-card border border-terminal-green/30 rounded-xl shadow-2xl overflow-hidden animate-fade-slide-in flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Window Top Bar */}
        <div className="h-9 bg-[#08090E] border-b border-terminal-green/15 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-terminal-green font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Layers size={13} />
              SYSTEM_ARCHITECTURE // KUKUCONNECT_PIPELINE
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-terminal-muted hover:text-white transition-colors p-1"
            title="Close (Esc)"
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-base font-bold text-white mb-1 font-sans">
              KukuConnect End-to-End Zero-Trust AI Architecture
            </h3>
            <p className="text-xs text-terminal-muted font-sans leading-relaxed">
              Interactive architectural breakdown of the fault-tolerant, hallucination-resistant veterinary backend system. Click any node to inspect security & data flow.
            </p>
          </div>

          {/* Interactive Pipeline Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {pipeline.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                  activeStep === idx
                    ? 'bg-terminal-green/10 border-terminal-green text-white shadow-[0_0_15px_rgba(0,255,159,0.15)]'
                    : 'bg-[#08090E]/60 border-white/10 hover:border-terminal-green/30 text-terminal-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  {step.icon}
                  <span className="text-[10px] font-bold font-mono">0{idx + 1}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold font-sans text-white mb-0.5 leading-tight">
                    {step.title.split('. ')[1]}
                  </h4>
                  <p className="text-[9px] text-terminal-muted truncate font-mono">
                    {step.tech.split(' / ')[0]}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Inspector Card */}
          <div className="p-5 rounded-xl bg-[#08090E] border border-terminal-green/20 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-terminal-green font-mono">
                  NODE_SPECS: {pipeline[activeStep].title.toUpperCase()}
                </span>
              </div>
              <span className="text-[10px] text-terminal-cyan bg-terminal-cyan/10 border border-terminal-cyan/20 px-2 py-0.5 rounded font-mono">
                {pipeline[activeStep].tech}
              </span>
            </div>

            <p className="text-xs text-terminal-text/90 font-sans leading-relaxed">
              {pipeline[activeStep].summary}
            </p>

            <div className="pt-2">
              <div className="text-[10px] text-terminal-muted uppercase tracking-wider mb-2 font-mono">
                Core Architectural Guardrails:
              </div>
              <ul className="space-y-1.5">
                {pipeline[activeStep].details.map((detail, idx) => (
                  <li key={idx} className="text-xs text-terminal-text/80 flex items-start gap-2 font-sans">
                    <ArrowRight size={13} className="text-terminal-green flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/5 bg-[#08090E] flex items-center justify-between text-[10px] text-terminal-muted">
          <span>Target SLA: 99.95% Availability</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-terminal-green/10 hover:bg-terminal-green text-terminal-green hover:text-black font-bold uppercase rounded transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
