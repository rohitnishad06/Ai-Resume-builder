import { Plus, Trash2 } from "lucide-react";
import React from "react";

const ProjectForm = ({ data, onChange }) => {
  // 🧩 Add a new empty project
  const addProject = () => {
    const newProject = {
      name: "",
      type: "",
      description: "",
    };
    onChange([...data, newProject]);
  };

  // ❌ Remove a project by index
  const removeProject = (index) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  // ✏️ Update specific project field (name, type, or description)
  const updateProject = (index, field, value) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
          <p className="text-sm text-gray-500">Add your academic or personal projects</p>
        </div>

        {/* ➕ Add Project Button */}
        <button
          onClick={addProject}
          type="button"
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* 🔽 List of Project Inputs */}
      <div className="space-y-4 mt-6">
        {data.map((project, index) => (
          <div
            key={index}
            className="p-4 border border-gray-200 rounded-lg space-y-3"
          >
            {/* Header for each project card */}
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project #{index + 1}</h4>

              {/* 🗑️ Remove Project Button */}
              <button
                onClick={() => removeProject(index)}
                type="button"
                className="text-rose-500 hover:text-rose-700 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            {/* ✍️ Input fields for project details */}
            <div className="grid gap-3">
              <input
                value={project.name || ""}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                type="text"
                placeholder="Project Name"
                className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                value={project.type || ""}
                onChange={(e) => updateProject(index, "type", e.target.value)}
                type="text"
                placeholder="Project Type (e.g., Web App, AI Model, etc.)"
                className="px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <textarea
                rows={4}
                value={project.description || ""}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                placeholder="Describe your project (tools, tech stack, results...)"
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 💡 Helpful Tip */}
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Describe each project briefly — include your role,
          technologies used, and the project’s impact or result.
        </p>
      </div>
    </div>
  );
};

export default ProjectForm;
