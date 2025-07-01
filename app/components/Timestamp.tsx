"use client";

import React, { useState, useEffect } from "react";

interface TimestampProps {
  date: Date;
}

export default function Timestamp({ date }: TimestampProps) {
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    setFormattedTime(
      date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  }, [date]);

  return <span className="text-xs opacity-70 mt-1">{formattedTime}</span>;
}
