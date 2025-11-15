import React, { useState } from "react";
import { Loader2, SparklesIcon } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";

const ProfessionalSummaryForm = ({ data, onChange, SetResumeData }) => {

  const {token} = useSelector(state => state.auth)
  const [isGenerating, SetIsGenerating] = useState(false)

  const generateSummary = async () => {
    try {
      SetIsGenerating(true)
      const prompt = `enhance my professional summary "${data}"`;
      const response = await api.post('/api/ai/enhance-pro-sum',{userContent:prompt} ,{headers:{Authorization: token}})
      SetResumeData(prev => ({...prev, professional_summary:response.data.enhanceContent}))
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }finally{
      SetIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Summary
          </h3>
          <p className="text-sm text-gray-500">
            Add a brief summary about yourself here.
          </p>
        </div>

        {/* AI Enhance button */}
        <button
          disabled={isGenerating}
          onClick={generateSummary}
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          {isGenerating ? (<Loader2 className="size-4 animate-spin"/>) : (<SparklesIcon className="w-4 h-4" />)}
          {isGenerating ? "Enhancing" : "AI Enhance"}
          
        </button>
      </div>

      {/* Textarea */}
      <div className="mt-6">
        <textarea
          value={data || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={7}
          className="w-full p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
          placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
        />

        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 Tip: Keep it concise (3–4 sentences) and focus on your most
          relevant achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSummaryForm;
