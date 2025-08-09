import { Button } from "@/components/ui/button";

interface SuggestionItemProps {
  id: string;
  time: string;
  suggestion: string;
  onNavigateToMessage: (messageId: string) => void;
}

/**
 * Component for rendering individual suggestion items
 * Displays timestamp, suggestion text, and navigation button
 */
export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  id,
  time,
  suggestion,
  onNavigateToMessage
}) => {
  return (
    <div className="text-[15px] text-foreground/85 mb-3 flex flex-col gap-1.5">
      <div className="text-[11px] text-muted-foreground">{time}</div>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 leading-relaxed">{suggestion}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigateToMessage(id)}
          className="text-[11px] px-2.5 py-1.5 h-auto"
        >
          Jump
        </Button>
      </div>
    </div>
  );
}; 