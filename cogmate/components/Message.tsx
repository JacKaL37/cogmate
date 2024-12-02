import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type MessageProps = {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  temperature?: number;
  customColor?: string | string[];
  agentName?: string;
};

const getTextColorBasedOnBackground = (bgColor: string) => {
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 125 ? "black" : "white";
};

const Message: React.FC<MessageProps> = ({ role, content, model, temperature, customColor }) => {
  const getCardClassName = () => {
    let classNames = "mb-4 bg-opacity-30";
    let colorClasses;

    switch (role) {
      case "user":
        colorClasses = "bg-fuchsia-900 border-fuchsia-700";
        break;
      case "assistant":
        colorClasses = "bg-cyan-900 border-cyan-700";
        break;
      case "system":
        colorClasses = "bg-indigo-900 border-indigo-700";
        break;
      default:
        colorClasses = "bg-purple-900 border-purple-700";
        break;
    }

    return `${classNames} ${colorClasses}`;
  };

  const getCardStyles = () => {
    if (customColor) {
      if (Array.isArray(customColor)) {
        return {
          background: `linear-gradient(${customColor.join(", ")})`,
          borderColor: customColor[0],
        };
      } else {
        return {
          backgroundColor: customColor,
          borderColor: customColor,
        };
      }
    }
    return {};
  };

  const getRoleTextColor = () => {
    switch (role) {
      case "user":
        return "text-fuchsia-500";
      case "assistant":
        return "text-cyan-500";
      case "system":
        return "text-indigo-500";
      default:
        return "text-fuchsia-500";
    }
  };

  const cardStyles = getCardStyles();
  const textColor = Array.isArray(customColor) ? getTextColorBasedOnBackground(customColor[0]) : (customColor ? getTextColorBasedOnBackground(customColor) : "white");

  return (
    <Card
      className={`${getCardClassName()} max-w-2xl mx-auto`}
      style={cardStyles}
    >
      <CardContent className="p-4" style={{ color: textColor }}>
        <div className="flex justify-start items-center mb-2">
          <span className={`font-bold ${getRoleTextColor()}`} style={{ color: textColor }}>{role}</span>
          {model && <span className="text-sm text-cyan-400 mx-2">{model}</span>}
          {temperature !== undefined && (
            <span className="text-sm text-indigo-400 mx-2">
              {temperature.toFixed(2)}
            </span>
          )}
        </div>
        <ReactMarkdown>{content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default Message;