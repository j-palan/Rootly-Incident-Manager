import { useState } from "react";

import MOCK_INCIDENT_TRANSCRIPT_INFO from "../statics";

// Custom hooks
import { useSimulationTimer } from "../hooks/useSimulationTimer";
import { useMessageNavigation } from "../hooks/useMessageNavigation";
import { useCategorizedSuggestions } from "../hooks/useCategorizedSuggestions";
import { useReportGeneration } from "../hooks/useReportGeneration";

// Services
import { IncidentService } from "../services/incidentService";

// Components
import { SimulationHeader } from "../components/incident/SimulationHeader";
import { ReportModal } from "../components/incident/ReportModal";
import { MessageList } from "../components/incident/MessageList";
import { IncidentSuggestions } from "../components/incident/IncidentSuggestions";

// Types
import type { Message } from "../types/incident";

/**
 * Main component for the Incident Replay Page
 * Orchestrates the simulation, message handling, and report generation
 */
const IncidentReplayPage = () => {
  // Constants
  const MOCK_INCIDENT_TRANSCRIPT = MOCK_INCIDENT_TRANSCRIPT_INFO.MOCK_INCIDENT_TRANSCRIPT.meeting_transcript;
  const TIME_PER_MESSAGE = MOCK_INCIDENT_TRANSCRIPT_INFO.TIME_PER_MESSAGE;

  // Services
  const incidentService = new IncidentService();

  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Custom hooks
  const { elapsedTime, formatTime, resetTimer } = useSimulationTimer(isPlaying);
  const { scrollToMessage } = useMessageNavigation();
  const { categorizedSuggestions, categorizeMessage, resetSuggestions } = useCategorizedSuggestions();
  const { 
    showReportModal, 
    isGeneratingReport, 
    reportData, 
    generateReport, 
    closeModal, 
    progress,
    hasGeneratedReport,
    viewStoredReport
  } = useReportGeneration();

  /**
   * Get current timestamp in formatted string
   */
  const getTime = (): string => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  /**
   * Start the incident simulation
   * Processes messages sequentially with API calls
   */
  const startIncident = async (): Promise<void> => {
    setIsPlaying(true);
    setHasPlayed(true);
    
    for (let i = 0; i < MOCK_INCIDENT_TRANSCRIPT.length; i++) {
      const message = MOCK_INCIDENT_TRANSCRIPT[i];
      const newMessage: Message = {
        id: `message-${i}`,
        speaker: message.speaker,
        text: message.text,
        order: i,
        type: "None",
        isLoading: true,
        time: getTime()
      };
      
      // Add message to UI immediately
      setMessages(prev => [...prev, newMessage]);
      
      // Send API request asynchronously (don't await)
      incidentService.sendMessage({
        message: {
          speaker: message.speaker,
          text: message.text,
          order: i,
        },
      }).then((data) => {
        // Update message with response when it comes back
        setMessages(prev => prev.map(msg => 
          msg.order === i 
            ? { 
                ...msg, 
                response: data, 
                isLoading: false,
                type: data.type,
              }
            : msg
        ));
        
        // Categorize the message
        categorizeMessage(data, newMessage.time || getTime(), newMessage.id);
      }).catch((error) => {
        console.error('Error processing message:', error);
        setMessages(prev => prev.map(msg => 
          msg.order === i 
            ? { 
                ...msg, 
                response: { error: 'Failed to get response' }, 
                isLoading: false, 
                type: "None" 
              }
            : msg
        ));
      });
      
      // Wait before processing next message (but don't wait for API response)
      if (i < MOCK_INCIDENT_TRANSCRIPT.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, TIME_PER_MESSAGE));
      }
    }
    
    setIsPlaying(false);
    setIsFinished(true);
  };

  /**
   * Handle simulation start
   * Resets state and starts the incident simulation
   */
  const handleSimulateIncident = (): void => {
    setMessages([]);
    resetSuggestions();
    resetTimer();
    startIncident();
  };

  /**
   * Handle report generation
   * Triggers the report generation process
   */
  const handleGenerateReport = (): void => {
    generateReport(categorizedSuggestions, messages.length, formatTime(elapsedTime));
  };

  return ( 
    <div className="w-full h-screen flex flex-col bg-background font-[Futura,system-ui,ui-sans-serif]">
      {/* Header */}
      <SimulationHeader
        title="Incident Manager"
        elapsedTime={elapsedTime}
        formatTime={formatTime}
        isPlaying={isPlaying}
        isFinished={isFinished}
        isGenerating={true}
        progress={(() => {
          const totalMs = MOCK_INCIDENT_TRANSCRIPT.length * TIME_PER_MESSAGE;
          if (isFinished) return 100;
          if (!hasPlayed || totalMs === 0) return 0;
          const pct = Math.round(((elapsedTime * 1000) / totalMs) * 100);
          return Math.min(100, Math.max(0, pct));
        })()}
        onSimulateIncident={handleSimulateIncident}
        onGenerateReport={handleGenerateReport}
        hasGeneratedReport={hasGeneratedReport}
        onViewReport={viewStoredReport}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-row gap-0 overflow-hidden min-h-0">
        {/* Insights Left */}
        {hasPlayed && (
          <IncidentSuggestions
            categorizedSuggestions={categorizedSuggestions}
            onNavigateToMessage={scrollToMessage}
          />
        )}
        {/* Transcript Right */}
        <MessageList messages={messages} />
      </div>

      {!hasPlayed &&
      <div className="flex justify-center mt-60 h-full">
        <h1 className="text-sm font-medium text-muted-foreground">To start click Simulate Incident</h1>
      </div>}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        isGenerating={isGeneratingReport}
        reportData={reportData}
        categorizedSuggestions={categorizedSuggestions}
        totalMessages={messages.length}
        duration={formatTime(elapsedTime)}
        onClose={closeModal}
      />
    </div>
  );
};

export default IncidentReplayPage;