import { GraduationCap, Plus, Trash2 } from "lucide-react";
import React from "react";

const EducationForm = ({ data, onChange }) => {
  // ➕ Add a new empty education entry
  const addEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      graduation_date: "",
      gpa: "",
    };
    onChange([...data, newEducation]);
  };

  // ❌ Remove an education entry by index
  const removeEducation = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ✏️ Update a specific education field
  const updateEducation = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* 🔹 Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <p className="text-sm text-gray-500">Add your education details</p>
        </div>

        {/* ➕ Add Education Button */}
        <button
          onClick={addEducation}
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {/* 🏫 Empty State - Shown when no education is added */}
      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No Education Added Yet.</p>
          <p className="text-sm">Click "Add Education" to get started</p>
        </div>
      ) : (
        // 📋 List of Education Entries
        <div className="space-y-4">
          {data.map((education, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              {/* 🎓 Header for Each Education Entry */}
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education #{index + 1}</h4>
                <button
                  onClick={() => removeEducation(index)}
                  type="button"
                  className="text-rose-500 hover:text-rose-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* 🧩 Input Fields for Education Details */}
              <div className="grid md:grid-cols-2 gap-3">
                {/* Institution */}
                <input
                  value={education.institution || ""}
                  onChange={(e) =>
                    updateEducation(index, "institution", e.target.value)
                  }
                  type="text"
                  placeholder="Institution Name"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Degree */}
                <input
                  value={education.degree || ""}
                  onChange={(e) =>
                    updateEducation(index, "degree", e.target.value)
                  }
                  type="text"
                  placeholder="Degree (e.g., Bachelor's, Master's)"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Field of Study */}
                <input
                  value={education.field || ""}
                  onChange={(e) =>
                    updateEducation(index, "field", e.target.value)
                  }
                  type="text"
                  placeholder="Field of Study"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Graduation Date */}
                <input
                  value={education.graduation_date || ""}
                  onChange={(e) =>
                    updateEducation(index, "graduation_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              {/* GPA (Optional) */}
              <input
                value={education.gpa || ""}
                onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                type="text"
                placeholder="GPA (optional)"
                className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          ))}
        </div>
      )}

      {/* 💡 Helpful Tip */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Include your most recent education first.
          Mention institution name, degree, field, and graduation date.
        </p>
      </div>
    </div>
  );
};

export default EducationForm;
