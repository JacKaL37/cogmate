"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import {
  Send,
  Save,
  Trash2,
  FolderOpen,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

// Types
type Message = {
  role: "user" | "assistant" | "system";
  content: string;
  model?: string;
  temperature?: number;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatState = {
  chats: Chat[];
  currentChatId: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  customInstructions: string;
  useCustomInstructions: boolean;
};

// Components

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const getCardClassName = () => {
    switch (message.role) {
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
    switch (message.role) {
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
          <span className={`font-bold ${getRoleTextColor()}`}>
            {message.role}
          </span>
          {message.model && (
            <span className="text-sm text-cyan-400 mx-2">{message.model}</span>
          )}
          {message.temperature !== undefined && (
            <span className="text-sm text-indigo-400 mx-2">
              {message.temperature.toFixed(2)}
            </span>
          )}
        </div>
        <ReactMarkdown className="text-white">{message.content}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};

const ConversationPanel: React.FC<{ messages: Message[] }> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-black">
      {messages.map((message, index) => (
        <ChatMessage key={index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

const InputPanel: React.FC<{
  onSend: (message: string) => void;
  isLoading: boolean;
}> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="p-4 bg-purple-900 bg-opacity-50 backdrop-blur-lg flex items-center">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message here... (Ctrl/Cmd + Enter to send)"
        className="flex-grow mr-2 bg-black bg-opacity-50 text-white border-purple-700 focus:border-fuchsia-500"
        rows={1}
      />
      <Button
        onClick={handleSend}
        disabled={isLoading}
        className="bg-fuchsia-600 hover:bg-fuchsia-700"
      >
        <Send className="mr-2 h-4 w-4" /> Send
      </Button>
    </div>
  );
};

const OptionsPanel: React.FC<{
  chatState: ChatState;
  onUpdateChatState: (updates: Partial<ChatState>) => void;
  onSave: () => void;
  onOpen: () => void;
  onDelete: () => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({
  chatState,
  onUpdateChatState,
  onSave,
  onOpen,
  onDelete,
  isOpen,
  onClose,
}) => {
  const premadePrompts = {
    default: "You are a helpful assistant.",
    creative: "You are a creative writing assistant.",
    coder: "You are a coding assistant.",
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-cyan-900 bg-opacity-50 backdrop-blur-lg bg-blend-color-burn
        p-4 transition-transform duration-300 ease-in-out z-10 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
    >
      <Button
        onClick={onClose}
        className="absolute top-4 left-4 bg-transparent hover:bg-purple-800"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="mt-12 space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={onSave}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700"
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          <Button
            onClick={onOpen}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700"
          >
            <FolderOpen className="mr-2 h-4 w-4" /> Open
          </Button>
          <Button
            onClick={onDelete}
            className="flex-1 bg-cerise-600 hover:bg-cerise-700"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>

        <Input
          placeholder="User ID"
          className="bg-purple-800 text-white border-purple-700 focus:border-fuchsia-500"
        />

        <Input
          placeholder="API Key"
          type="password"
          className="bg-purple-800 text-white border-purple-700 focus:border-fuchsia-500"
        />

        <Select
          value={chatState.model}
          onValueChange={(value) => onUpdateChatState({ model: value })}
        >
          <SelectTrigger className="bg-purple-800 text-white border-purple-700">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
            <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
          </SelectContent>
        </Select>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Temperature: {chatState.temperature.toFixed(2)}
          </label>
          <Slider
            value={[chatState.temperature]}
            onValueChange={([value]) =>
              onUpdateChatState({ temperature: value })
            }
            max={1}
            step={0.01}
            className="bg-purple-800"
          />
        </div>

        <Select
          value={chatState.systemPrompt}
          onValueChange={(value) =>
            onUpdateChatState({
              systemPrompt:
                premadePrompts[value as keyof typeof premadePrompts],
            })
          }
        >
          <SelectTrigger className="bg-purple-800 text-white border-purple-700">
            <SelectValue placeholder="Select System Prompt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="coder">Coder</SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          value={chatState.systemPrompt}
          readOnly
          className="bg-purple-800 text-white border-purple-700"
          rows={4}
        />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="custom-instructions"
            checked={chatState.useCustomInstructions}
            onCheckedChange={(checked) =>
              onUpdateChatState({ useCustomInstructions: checked as boolean })
            }
          />
          <label
            htmlFor="custom-instructions"
            className="text-sm font-medium text-white"
          >
            Enable Custom Instructions
          </label>
        </div>

        <Textarea
          value={chatState.customInstructions}
          onChange={(e) =>
            onUpdateChatState({ customInstructions: e.target.value })
          }
          placeholder="Enter custom instructions..."
          className="bg-purple-800 text-white border-purple-700 focus:border-fuchsia-500"
          rows={4}
          disabled={!chatState.useCustomInstructions}
        />
      </div>
    </div>
  );
};

const ChatHistoryPanel: React.FC<{
  chats: Chat[];
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ chats, currentChatId, onSelectChat, onNewChat, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-indigo-900 bg-opacity-50 backdrop-blur-lg p-4 transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 bg-transparent hover:bg-purple-800"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="mt-12 space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-purple-800 text-white border-purple-700 focus:border-fuchsia-500"
          />
        </div>
        <Button
          onClick={onNewChat}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-700"
        >
          <Plus className="mr-2 h-4 w-4" /> New Chat
        </Button>
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full justify-start ${
                chat.id === currentChatId ? "bg-purple-700" : "bg-purple-800"
              } hover:bg-purple-700`}
            >
              {chat.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AIChat: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("chatState");
      if (savedState) {
        return JSON.parse(savedState);
      }
    }
    return {
      chats: [{ id: "1", title: "New Chat", messages: [] }],
      currentChatId: "1",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      systemPrompt: "You are a helpful assistant.",
      customInstructions: "",
      useCustomInstructions: false,
    };
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("chatState", JSON.stringify(chatState));
  }, [chatState]);

  const updateChatState = (updates: Partial<ChatState>) => {
    setChatState((prev) => ({ ...prev, ...updates }));
  };

  const handleSend = async (message: string) => {
    const currentChat = chatState.chats.find(
      (chat) => chat.id === chatState.currentChatId
    );
    if (!currentChat) return;

    const newMessage: Message = { role: "user", content: message };
    const updatedMessages = [...currentChat.messages, newMessage];

    updateChatState({
      chats: chatState.chats.map((chat) =>
        chat.id === chatState.currentChatId
          ? { ...chat, messages: updatedMessages }
          : chat
      ),
    });

    setIsLoading(true);

    // Simulating API call and streaming response
    const assistantMessage: Message = {
      role: "assistant",
      content:
        "This is a simulated response. In a real implementation, you would send the message to the OpenAI API and stream the response back.",
      model: chatState.model,
      temperature: chatState.temperature,
    };

    // Simulate streaming
    let streamedContent = "";
    for (let i = 0; i < assistantMessage.content.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      streamedContent += assistantMessage.content[i];
      updateChatState({
        chats: chatState.chats.map((chat) =>
          chat.id === chatState.currentChatId
            ? {
                ...chat,
                messages: [
                  ...updatedMessages,
                  { ...assistantMessage, content: streamedContent },
                ],
              }
            : chat
        ),
      });
    }

    setIsLoading(false);
  };

  const handleSave = () => {
    console.log("Saving chat...");
  };

  const handleOpen = () => {
    console.log("Opening chat...");
  };

  const handleDelete = () => {
    console.log("Deleting chat...");
    updateChatState({
      chats: chatState.chats.filter(
        (chat) => chat.id !== chatState.currentChatId
      ),
      currentChatId: chatState.chats[0]?.id || "",
    });
  };

  const handleNewChat = () => {
    const newChatId = Date.now().toString();
    updateChatState({
      chats: [
        ...chatState.chats,
        { id: newChatId, title: "New Chat", messages: [] },
      ],
      currentChatId: newChatId,
    });
  };

  const handleSelectChat = (chatId: string) => {
    updateChatState({ currentChatId: chatId });
  };

  const currentChat = chatState.chats.find(
    (chat) => chat.id === chatState.currentChatId
  );

  return (
    <div className="flex h-screen bg-black text-white relative">
      <ChatHistoryPanel
        chats={chatState.chats}
        currentChatId={chatState.currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
      <div className="flex flex-col flex-1 relative">
        <div className="flex justify-between p-4 bg-purple-900 bg-opacity-50 backdrop-blur-lg z-10">
          <Button
            onClick={() => setIsHistoryOpen(true)}
            className="bg-indigo-950 hover:bg-indigo-800"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <Button
            onClick={() => setIsOptionsOpen(true)}
            className="bg-cyan-950 hover:bg-cyan-800"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>
        {currentChat && (
          <>
            <ConversationPanel messages={currentChat.messages} />
            <InputPanel onSend={handleSend} isLoading={isLoading} />
          </>
        )}
      </div>
      <OptionsPanel
        chatState={chatState}
        onUpdateChatState={updateChatState}
        onSave={handleSave}
        onOpen={handleOpen}
        onDelete={handleDelete}
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
      />
    </div>
  );
};

export default AIChat;
