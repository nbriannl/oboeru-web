import React from "react";

export default function NavBar({ bg }) {
  const bgColor = bg === "dark" 
    ? "bg-slate-800" 
    : "bg-red-600";
    
  return (
    <nav className={`${bgColor} text-white shadow-md p-4`}>
      <div className="container mx-auto flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">
          Oboeru <span className="opacity-80 font-normal">覚える</span>
        </span>
        <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">
          Vocabulary Quiz
        </span>
      </div>
    </nav>
  );
}
