"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Heart, Shield, Users, MessageCircle } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";
import { translations } from "./i18n/translations";
import LanguageToggle from "./components/LanguageToggle";
import Timestamp from "./components/Timestamp";

interface Message {
  id: string;
  text: string;
  sender: "user" | "counselor";
  timestamp: Date;
}

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: t.welcome,
      sender: "counselor",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const scrollToBottom = () => {
    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  // Track previous message count to detect new messages
  const prevMessageCountRef = useRef(messages.length);

  // Only scroll when new messages are added, not when existing messages are updated
  useEffect(() => {
    // Only scroll if we have more messages than before (new message added)
    if (messages.length > prevMessageCountRef.current) {
      scrollToBottom();
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  // Scroll to bottom when loading state changes (for typing indicator)
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === "1" ? { ...msg, text: t.welcome } : msg))
    );
  }, [language, t.welcome]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/counselor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputText,
          conversationHistory: messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const counselorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "counselor",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, counselorMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          language === "en"
            ? "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
            : "抱歉，我现在连接有问题。请稍后再试。",
        sender: "counselor",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-counselor-50 to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-counselor-500 to-primary-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t.title}
                </h1>
                <p className="text-sm text-gray-600">{t.subtitle}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`chat-bubble ${
                    message.sender === "user"
                      ? "user-bubble"
                      : "counselor-bubble"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <Timestamp date={message.timestamp} />
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="counselor-bubble">
                  <div className="typing-indicator">
                    <div
                      className="typing-dot"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="typing-dot"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="typing-dot"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{t.send}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="w-6 h-6 text-counselor-500" />
              <h3 className="font-semibold text-gray-900">
                {t.features.professional.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t.features.professional.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <Heart className="w-6 h-6 text-counselor-500" />
              <h3 className="font-semibold text-gray-900">
                {t.features.compassionate.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t.features.compassionate.description}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3 mb-3">
              <MessageCircle className="w-6 h-6 text-counselor-500" />
              <h3 className="font-semibold text-gray-900">
                {t.features.availability.title}
              </h3>
            </div>
            <p className="text-gray-600 text-sm">
              {t.features.availability.description}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>{t.disclaimer.title}</strong> {t.disclaimer.text}
          </p>
        </div>
      </main>
    </div>
  );
}
