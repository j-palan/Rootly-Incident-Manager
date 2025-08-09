import { Button } from "@/components/ui/button";
import { Play, FileText, Clock, CircleNotch } from "phosphor-react";
import * as React from "react";

interface SimulationHeaderProps {
  title: string;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  isPlaying: boolean;
  isFinished: boolean;
  onSimulateIncident: () => void;
  onGenerateReport: () => void;
  progress?: number;
  isGenerating?: boolean;
  hasGeneratedReport?: boolean;
  onViewReport?: () => void;
}

/**
 * Header component for the incident simulation
 * Displays title, elapsed time, and control buttons
 */
export const SimulationHeader: React.FC<SimulationHeaderProps> = ({
  title,
  elapsedTime,
  formatTime,
  isPlaying,
  isFinished,
  onSimulateIncident,
  onGenerateReport,
  progress = 0,
  isGenerating = false,
  hasGeneratedReport = false,
  onViewReport
}) => {
  const logoSrc = "/rootly_logo.png"; // served from client/public

  return (
    <div className="w-full border-b border-border px-8 pt-6 pb-6 glass-panel relative">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Incident Manager Logo"
              className="h-12 w-12 rounded-sm"/>
            <h1 className="w-fit whitespace-nowrap ml-0 text-center text-3xl tracking-wide font-semibold app-title">
              {title}
            </h1>
          </div>
        </div>

        {/* Centered Controls */}
        <div className="absolute left-1/2 -translate-x-1/2 flex gap-3">
          <Button 
            onClick={onSimulateIncident} 
            disabled={isPlaying}
            size="lg"
            className={`w-[180px] h-10 ${isPlaying ? "opacity-50" : ""}`}
          >
            {isPlaying ? "Simulating..." : "Simulate Incident"}
            {!isPlaying ? <Play className="ml-2" size={18} /> : <CircleNotch className="ml-2 animate-spin" size={18} />}
          </Button>
          {hasGeneratedReport ? (
            <Button 
              onClick={onViewReport}
              size="lg"
              className="w-[180px] h-10"
            >
              View Report
              <FileText className="ml-2" size={18} />
            </Button>
          ) : (
            <Button 
              onClick={onGenerateReport} 
              disabled={!isFinished}
              size="lg"
              className={`w-[180px] h-10 ${!isFinished ? "opacity-50" : ""}`}
            >
              Generate Report
              <FileText className="ml-2" size={18} />
            </Button>
          )}
        </div>

        {/* Elapsed Time Display */}
        {(isPlaying || isFinished) && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-secondary/60 border border-border">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {formatTime(elapsedTime)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar under buttons */}
      <div className="mt-6" aria-hidden={!isGenerating && progress === 0}>
        <div className="w-full max-w-xl mx-auto h-3 rounded-full bg-input border border-border overflow-hidden">
          <div
            className="h-full bg-[oklch(0.66_0.16_205)] transition-[width] duration-300"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 