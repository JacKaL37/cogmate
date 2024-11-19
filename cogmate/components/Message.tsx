
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

type MessageProps = {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  temperature?: number;
};

const Message: React.FC<MessageProps> = ({ role, content, model, temperature }) => {
  const getCardClassName = () => {
    switch (role) {
      case "user":
        return "mb-4 bg-fuchsia-900 bg-opacity-30 border-fuchsia-700";
      case "assistant":
        return "mb-4 bg-cyan-900 bg-opacity-30 border-cyan-700";
      case "system":
        return "mb-4 bg-indigo-900 bg-opacity-30 border-indigo-700";
      default:
        return "mb-4 bg-purple-900 bg-opacity-30 border-purple-700";
    }
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

  return (
    <Card className={`${getCardClassName()} max-w-2xl mx-auto`}>
      <CardContent className="p-4">
        <div className="flex justify-start items-center mb-2 justify">
          <span className={`font-bold ${getRoleTextColor()}`}>{role}</span>
          {model && <span className="text-sm text-cyan-400 mx-2">{model}</span>}
          {temperature !== undefined && (
            <span className="text-sm text-indigo-400 mx-2">
              {temperature.toFixed(2)}
            </span>
          )}
        </div>
        <ReactMarkdown className="text-white">{content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default Message;