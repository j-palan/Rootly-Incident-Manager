import { Button } from "@/components/ui/button";
import { CircleNotch, CheckSquare, Clock, Warning, Info, ListChecks } from "phosphor-react";
import type { ReportData } from "../../hooks/useReportGeneration";
import type { CategorizedSuggestions } from "../../hooks/useCategorizedSuggestions";
import * as React from "react";

interface ReportModalProps {
  isOpen: boolean;
  isGenerating: boolean;
  reportData: ReportData | null;
  categorizedSuggestions: CategorizedSuggestions;
  totalMessages: number;
  duration: string;
  onClose: () => void;
}

/**
 * Hollow Pie Chart Component
 */
const PieChart: React.FC<{ data: Array<{ label: string; value: number; color: string; icon: React.ComponentType<any> }> }> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // Start from top
  
  const segments = data.map((item, index) => {
    const percentage = total > 0 ? (item.value / total) * 100 : 0;
    const startAngle = currentAngle;
    const endAngle = currentAngle + (percentage * 3.6); // 3.6 degrees per 1%
    currentAngle = endAngle;
    
    const isHovered = hoveredIndex === index;
    const scale = isHovered ? 1.1 : 1;
    const strokeWidth = isHovered ? 2 : 1;
    
    // Calculate SVG path for hollow pie chart
    const radius = 80;
    const innerRadius = 50;
    const hoverRadius = isHovered ? radius + 5 : radius;
    const hoverInnerRadius = isHovered ? innerRadius + 5 : innerRadius;
    const centerX = 100;
    const centerY = 100;
    
    const startRadians = startAngle * (Math.PI / 180);
    const endRadians = endAngle * (Math.PI / 180);
    
    const x1 = centerX + Math.cos(startRadians) * hoverRadius;
    const y1 = centerY + Math.sin(startRadians) * hoverRadius;
    const x2 = centerX + Math.cos(endRadians) * hoverRadius;
    const y2 = centerY + Math.sin(endRadians) * hoverRadius;
    
    const x1Inner = centerX + Math.cos(startRadians) * hoverInnerRadius;
    const y1Inner = centerY + Math.sin(startRadians) * hoverInnerRadius;
    const x2Inner = centerX + Math.cos(endRadians) * hoverInnerRadius;
    const y2Inner = centerY + Math.sin(endRadians) * hoverInnerRadius;
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    // Create the path for the segment
    const outerArc = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    const lineToInner = `L ${x2Inner} ${y2Inner}`;
    const innerArc = `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1Inner} ${y1Inner}`;
    const closePath = 'Z';
    
    const path = `${outerArc} ${lineToInner} ${innerArc} ${closePath}`;
    
    return (
      <g key={index} style={{ zIndex: isHovered ? 10 : 1 }}>
        <path
          d={path}
          fill={item.color}
          stroke="none"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        />
        <path
          d={path}
          fill="none"
          stroke={isHovered ? "rgba(255, 255, 255, 0.8)" : item.color}
          strokeWidth={strokeWidth}
          opacity={0.8}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        />
      </g>
    );
  });
  
  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {segments}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-200 ${
              index === data.length - 1 && data.length % 2 === 1 ? 'col-span-2 justify-center' : ''
            }`}
            style={{
              backgroundColor: hoveredIndex === index ? `${item.color}20` : 'transparent',
              transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
              textShadow: hoveredIndex === index ? '0 0 8px rgba(255, 255, 255, 0.8)' : 'none',
              color: hoveredIndex === index ? 'white' : 'inherit'
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="font-medium">{item.label}</span>
            <span className="text-muted-foreground">({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Modal component for displaying incident reports
 * Shows loading states, error handling, and formatted report data
 */
export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  isGenerating,
  reportData,
  categorizedSuggestions,
  totalMessages,
  duration,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto border border-border elevated">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-foreground">Incident Report</h2>
          <div className="flex items-center">
            <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              ✕
            </Button>
          </div>
        </div>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <CircleNotch size={28} className="animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating incident report...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-4">
            {reportData.error ? (
              <div className="text-red-400 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                {reportData.error}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-secondary/30 border border-border rounded-lg">
                    <div className="font-medium text-muted-foreground">Total Messages</div>
                    <div className="text-2xl font-normal text-foreground">{totalMessages}</div>
                  </div>
                  <div className="p-3 bg-secondary/30 border border-border rounded-lg">
                    <div className="font-medium text-muted-foreground">Simulation Duration</div>
                    <div className="text-2xl font-normal text-foreground">{duration}</div>
                  </div>
                </div>
                
                {/* Suggestions Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Suggestions Summary</h3>
                  <PieChart data={[
                    {
                      label: "Action Items",
                      value: categorizedSuggestions.actionItems.length,
                      color: "oklch(0.69 0.19 276)",
                      icon: CheckSquare
                    },
                    {
                      label: "Timeline Events", 
                      value: categorizedSuggestions.timelineEvents.length,
                      color: "oklch(0.66 0.16 205)",
                      icon: Clock
                    },
                    {
                      label: "Root Cause Signals",
                      value: categorizedSuggestions.rootCauseSignals.length,
                      color: "oklch(0.70 0.23 16)",
                      icon: Warning
                    },
                    {
                      label: "Metadata Hints",
                      value: categorizedSuggestions.metadataHints.length,
                      color: "oklch(0.76 0.18 70)",
                      icon: Info
                    },
                    {
                      label: "Follow-ups",
                      value: categorizedSuggestions.followUps.length,
                      color: "oklch(0.62 0.23 303)",
                      icon: ListChecks
                    }
                  ]} />
                </div>
                
                {/* Generated Report */}
                {reportData.report && (
                  <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Generated Report</h4>
                    <pre className="text-sm text-foreground whitespace-pre-wrap">{reportData.report}</pre>
                  </div>
                )}
                
                {/* Incident Summary */}
                {reportData.summary && (
                  <div className="mt-6 p-4 bg-secondary/30 border border-border rounded-lg">
                    <div className="text-sm text-foreground whitespace-pre-wrap prose prose-sm max-w-none">
                      {reportData.summary
                        .replace(/```markdown\n|\n```/g, '')
                        .replaceAll("#", "")
                        .replaceAll("*", "")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-red-400 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            No report data available.
          </div>
        )}
      </div>
    </div>
  );
}; 