import React from "react";

export default function QuestionCard(props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden text-center mb-6">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800">{props.title}</h3>
        <p className="text-lg text-gray-600">{props.text}</p>
      </div>
      <div className="bg-gray-50 p-4 border-t border-gray-100 text-sm md:text-base flex justify-center items-center space-x-2">
        <span className="font-semibold text-gray-500">Q</span>
        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{props.currentQnNum}</span>
        <span className="text-gray-400">out of</span>
        <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-bold">{props.numTotal}</span>
        
        <span className="mx-2 text-gray-300">|</span>
        
        <i className="fa fa-check text-green-500"></i>
        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-bold">{props.numCorrect}</span>
        
        <i className="fa fa-times text-red-500 ml-2"></i>
        <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-bold">{props.numWrong}</span>
      </div>
    </div>
  );
}
