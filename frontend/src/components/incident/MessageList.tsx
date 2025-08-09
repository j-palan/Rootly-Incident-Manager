import { CheckSquare, Clock, Warning, Info, ListChecks } from "phosphor-react";
import type { Message } from "../../types/incident";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface MessageListProps {
  messages: Message[];
}

/**
 * Component for rendering individual message type icons
 */
const MessageTypeIcon: React.FC<{ type: string; size?: number }> = ({ type, size = 20 }) => {
  switch (type) {
    case "Action_Item":
      return <CheckSquare size={size} className="text-[oklch(0.69_0.19_276)]" />;
    case "Timeline_Event":
      return <Clock size={size} className="text-[oklch(0.66_0.16_205)]" />;
    case "Root_Cause_Signal":
      return <Warning size={size} className="text-[oklch(0.70_0.23_16)]" />;
    case "Metadata_Hint":
      return <Info size={size} className="text-[oklch(0.76_0.18_70)]" />;
    case "Follow_Up":
      return <ListChecks size={size} className="text-[oklch(0.62_0.23_303)]" />;
    default:
      return null;
  }
};

/**
 * Component for rendering individual message items
 */
const MessageItem: React.FC<{ message: Message }> = ({ message }) => (
  <div id={message.id} className="p-5 mb-4 border border-border rounded-2xl bg-card/70 elevated" data-message-type={message.type}>
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 border border-border flex items-center justify-center text-foreground text-sm font-semibold">
        {message.speaker.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="font-semibold text-foreground text-lg speaker-name">{message.speaker}</div>
          <div className="text-muted-foreground text-[11px]">{message.time}
          </div>
        </div>
        <div className="text-foreground/85 mt-1 leading-relaxed text-[15px]">{message.text}</div>
        
        {/* Loading indicator */}
        {message.isLoading && (
          <div className="mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Waiting for response...
            </div>
          </div>
        )}
        
        {/* API Response */}
        {message.response && !message.isLoading && message.response.suggestion !== "No Suggestion" && (
          <div className="mt-3 p-4 bg-secondary/40 rounded-lg border border-border relative flex flex-row-reverse gap-3">
            <div className="w-full flex flex-col justify-center items-start gap-1">
              <h1 className="text-[15px] text-foreground whitespace-pre-wrap pr-8">
                {message.response.suggestion}
              </h1>
            </div>
            {/* Type Icon */}
            <div className="w-fit h-full flex flex-col justify-center items-center">
              <MessageTypeIcon type={message.type} />
            </div>
          </div>
        )}
      </div>
      
      {/* Right-side category square */}
      {message.type !== "None" && (
        <div className="w-16 h-16 rounded-xl border border-border flex items-center justify-center bg-card/80">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{
            backgroundColor: (() => {
              switch (message.type) {
                case "Action_Item": return "oklch(0.69 0.19 276 / 0.2)";
                case "Timeline_Event": return "oklch(0.66 0.16 205 / 0.2)";
                case "Root_Cause_Signal": return "oklch(0.70 0.23 16 / 0.2)";
                case "Metadata_Hint": return "oklch(0.76 0.18 70 / 0.2)";
                case "Follow_Up": return "oklch(0.62 0.23 303 / 0.2)";
                default: return "transparent";
              }
            })(),
            border: `2px solid ${(() => {
              switch (message.type) {
                case "Action_Item": return "oklch(0.69 0.19 276)";
                case "Timeline_Event": return "oklch(0.66 0.16 205)";
                case "Root_Cause_Signal": return "oklch(0.70 0.23 16)";
                case "Metadata_Hint": return "oklch(0.76 0.18 70)";
                case "Follow_Up": return "oklch(0.62 0.23 303)";
                default: return "transparent";
              }
            })()}`
          }}>
            <MessageTypeIcon type={message.type} size={28} />
          </div>
        </div>
      )}
    </div>
  </div>
);

/**
 * Component for displaying the list of incident messages
 * Handles the rendering of all messages in the simulation
 */
export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useAutoScroll(messages);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-7 min-h-0 pb-12 bg-gradient-to-b from-background via-background/95 to-background">
      {messages.length > 0 && (
        <h1 className="text-[15px] tracking-wide mb-4 font-semibold text-foreground">Transcript</h1>
      )}
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}; 