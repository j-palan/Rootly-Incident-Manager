import { CheckSquare, Clock, Warning, Info, ListChecks } from "phosphor-react";
import type { CategorizedSuggestions } from "../../hooks/useCategorizedSuggestions";
import { SuggestionCategory } from "./SuggestionCategory";

interface IncidentSuggestionsProps {
  categorizedSuggestions: CategorizedSuggestions;
  onNavigateToMessage: (messageId: string) => void;
}

/**
 * Component for the incident suggestions sidebar
 * Displays all categorized suggestions in accordion format
 */
export const IncidentSuggestions: React.FC<IncidentSuggestionsProps> = ({
  categorizedSuggestions,
  onNavigateToMessage
}) => {
  const categories = [
    {
      value: "action-items",
      title: "Action Items",
      icon: CheckSquare,
      iconColor: "text-[oklch(0.69_0.19_276)]",
      suggestions: categorizedSuggestions.actionItems,
      isFirst: true
    },
    {
      value: "root-cause-signals",
      title: "Root Cause Signals",
      icon: Warning,
      iconColor: "text-[oklch(0.70_0.23_16)]",
      suggestions: categorizedSuggestions.rootCauseSignals
    },
    {
      value: "metadata-hints",
      title: "Metadata Hints",
      icon: Info,
      iconColor: "text-[oklch(0.76_0.18_70)]",
      suggestions: categorizedSuggestions.metadataHints
    },
    {
      value: "timeline-events",
      title: "Timeline Events",
      icon: Clock,
      iconColor: "text-[oklch(0.66_0.16_205)]",
      suggestions: categorizedSuggestions.timelineEvents
    },
    {
      value: "follow-ups",
      title: "Follow-up Tasks",
      icon: ListChecks,
      iconColor: "text-[oklch(0.62_0.23_303)]",
      suggestions: categorizedSuggestions.followUps,
      isLast: true
    }
  ];

  return (
    <div className="w-[40%] border-l border-border p-5 overflow-y-scroll bg-sidebar/50 backdrop-blur-md">
      <h1 className="text-[15px] tracking-wide mb-4 font-semibold text-foreground">Insights</h1>
      
      {categories.map((category) => (
        <SuggestionCategory
          key={category.value}
          value={category.value}
          title={category.title}
          icon={category.icon}
          iconColor={category.iconColor}
          suggestions={category.suggestions}
          onNavigateToMessage={onNavigateToMessage}
          isLast={category.isLast}
          isFirst={category.isFirst}
        />
      ))}
    </div>
  );
}; 