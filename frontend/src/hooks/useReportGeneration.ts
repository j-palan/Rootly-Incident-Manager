import { useEffect, useRef, useState } from 'react';
import type { CategorizedSuggestions } from './useCategorizedSuggestions';

export interface ReportData {
  report?: string;
  summary?: string;
  error?: string;
}

/**
 * Custom hook to manage report generation
 * Handles API calls, loading states, and modal visibility
 */
export const useReportGeneration = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const progressIntervalRef = useRef<number | null>(null);
  const [hasGeneratedReport, setHasGeneratedReport] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const generateReport = async (
    categorizedSuggestions: CategorizedSuggestions,
    totalMessages: number,
    duration: string
  ): Promise<void> => {
    setShowReportModal(true);
    setIsGeneratingReport(true);
    setReportData(null);
    setProgress(0);

    // Simulated progress while waiting for backend
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
    }
    progressIntervalRef.current = window.setInterval(() => {
      setProgress((p) => {
        if (p < 90) return p + 3; // advance steadily until 90%
        if (p < 96) return p + 1; // slow near the end
        return p; // hold
      });
      // no return needed
    }, 150);

    try {
      const response = await fetch("http://localhost:3000/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorizedSuggestions,
          totalMessages,
          simulationData: {
            duration
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const data = await response.json();
      // console.log("response", data);
      setReportData(data);
      setHasGeneratedReport(true);
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData({ error: 'Failed to generate report. Please try again.' });
    } finally {
      setIsGeneratingReport(false);
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);
    }
  };

  const viewStoredReport = (): void => {
    if (hasGeneratedReport && reportData) {
      setShowReportModal(true);
    }
  };

  const closeModal = (): void => {
    setShowReportModal(false);
    setProgress(0);
  };

  const resetReport = (): void => {
    setHasGeneratedReport(false);
    setReportData(null);
    setProgress(0);
  };

  return {
    showReportModal,
    isGeneratingReport,
    reportData,
    progress,
    hasGeneratedReport,
    generateReport,
    viewStoredReport,
    closeModal,
    resetReport
  };
}; 