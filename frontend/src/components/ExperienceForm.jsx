import { Briefcase, Loader2, Plus, Sparkles, Trash2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import api from "../configs/api";

const ExperienceForm = ({ data, onChange }) => {

  const {token} = useSelector(state => state.auth)
    const [generatingIndex, SetGeneratingIndex] = useState(-1)

  // ➕ Add a new empty experience object
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]); // Update parent state with new array
  };

  // ❌ Remove an experience entry by index
  const removeExperience = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ✏️ Update a specific experience field (company, position, etc.)
  const updateExperience = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };


  const generateDescription = async (index) => {
    SetGeneratingIndex(index)
    const experience = data[index]
    const prompt = `Enhance the following job description into 1–2 ATS-friendly sentences, highlighting measurable achievements and responsibilities:
                    Description: ${experience.description}
                    Position: ${experience.position}
                    Company: ${experience.company}
                    Return only the improved result.`;

    try {
      const {data} = await api.post('/api/ai/enhance-job-desc',{userContent:prompt} ,{headers:{Authorization: token}})
      updateExperience(index, "description", data.enhanceContent)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }finally{
      SetGeneratingIndex(-1)
    }
  }

  return (
    <div className="space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Experience
          </h3>
          <p className="text-sm text-gray-500">Add your Job Experience</p>
        </div>

        {/* ➕ Add Experience Button */}
        <button
          onClick={addExperience}
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>

      {/* 🧳 Empty State (Shown if no experiences added) */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No Work Experience Added Yet.</p>
          <p className="text-sm">Click "Add Experience" to get started</p>
        </div>
      ) : (
        // 📋 Experience Cards Section
        <div className="space-y-4">
          {data.map((experience, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              {/* 🏢 Header of each experience block */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience #{index + 1}</h4>

                {/* 🗑️ Delete Button */}
                <button
                  onClick={() => removeExperience(index)}
                  type="button"
                  className="text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* 🧩 Experience Input Fields */}
              <div className="grid md:grid-cols-2 gap-3">
                {/* Company Name */}
                <input
                  value={experience.company || ""}
                  onChange={(e) =>
                    updateExperience(index, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Job Position */}
                <input
                  value={experience.position || ""}
                  onChange={(e) =>
                    updateExperience(index, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Start Date */}
                <input
                  value={experience.start_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "start_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* End Date (disabled if currently working) */}
                <input
                  value={experience.end_date || ""}
                  onChange={(e) =>
                    updateExperience(index, "end_date", e.target.value)
                  }
                  type="month"
                  disabled={experience.is_current}
                  className="px-3 py-2 text-sm border rounded-lg disabled:bg-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* ✅ Checkbox for Current Job */}
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={experience.is_current || false}
                  onChange={(e) =>
                    updateExperience(index, "is_current", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Currently Working Here
              </label>

              {/* 📝 Job Description Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium">Job Description</label>

                  {/* “Enhance with AI” Button */}
                  <button
                    onClick={() => generateDescription(index)}
                    disabled={generatingIndex === index || !experience.position || !experience.company}
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                  >
                    {generatingIndex === index ? (<Loader2 className="w-3 h-3 animate-spin"/>) : (<Sparkles className="w-3 h-3" />)}
                    
                    Enhance with AI
                  </button>
                </div>

                {/* Description Textarea */}
                <textarea
                  value={experience.description || ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 💡 Helpful Tip */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Focus on achievements, tools used, and measurable impact.
          For example: “Improved website performance by 30% using React and Node.js.”
        </p>
      </div>
    </div>
  );
};

export default ExperienceForm;
