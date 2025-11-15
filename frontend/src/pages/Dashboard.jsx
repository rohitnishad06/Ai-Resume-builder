// Import necessary icons from lucide-react for UI buttons
import {
  FilePenIcon,
  LoaderCircleIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UploadCloudIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { dummyResumeData } from "../assets/assets"; // Dummy data for resumes
import { useNavigate } from "react-router-dom"; // For page navigation
import { useSelector } from "react-redux";
import api from "../configs/api";
import toast from "react-hot-toast";
import PdfToText from 'react-pdftotext'

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth)

  // Define some color themes for resume cards
  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"];

  // State variables
  const [allResumes, SetAllResumes] = useState([]);
  const [showUploadedResume, SetShowUploadedResume] = useState(false); 
  const [showCreatedResume, SetShowCreatedResume] = useState(false); 
  const [title, SetTitle] = useState(""); 
  const [resume, SetResume] = useState(null); 
  const [editResumeId, SetEditResumeId] = useState(""); 
  const [isloading, SetIsloading] = useState(false)

  const navigate = useNavigate(); 

  // Load dummy resumes into the dashboard
  const loadAllResumes = async () => {
    try {
      const {data} = await api.get('/api/users/resumes',{headers:{Authorization: token}})
      SetAllResumes(data.resume)
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.msg)
    }
  };

  // Function to create a new resume (navigates to builder page)
  const createResume = async (e) => {
    try {
      e.preventDefault(); 
      const {data} = await api.post('/api/resumes/create', {title}, {headers:{Authorization: token}})
      SetAllResumes([...allResumes, data.resume])
      SetTitle('')
      SetShowCreatedResume(false)
      navigate(`/app/builder/${data.resume.id}`)
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.msg)
    }
  };

  // Function to upload a resume (navigates to builder page)
  const uploadResume = async (e) => {
    e.preventDefault();
    SetIsloading(true)
    try {
      const resumeText = await PdfToText(resume)
      const {data} = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers:{Authorization: token}})
      SetTitle('')
      SetResume(null)
      SetShowUploadedResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.msg)
    }
    SetIsloading(false)
  };

  // Function to edit a resume title (future functionality)
  const editTitle = async (e) => {
    try {
      e.preventDefault();
       const {data} = await api.put(`/api/resumes/update/`, {resumeId: editResumeId, resumeData: {title}}, {headers:{Authorization: token}})
      SetAllResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume))
      SetTitle('')
      SetEditResumeId('')
      toast.success(data.msg)
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.msg)
    }

  };

  // Function to delete a resume by ID (with confirmation)
  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this resume?");
    if (confirm) {
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers:{Authorization: token}})
      SetAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.msg)
    }
    } catch (error) {
      toast.error(error?.response?.data?.msg || error.msg)
    }
  };

  // Load resumes when the component mounts
  useEffect(() => {
    loadAllResumes();
  }, []);

  return (
    <>
      <div className="max-w-7xl mx-auto px--4 py-8">

        {/* Greeting Section */}
        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, Rohit
        </p>

        {/* Create / Upload Resume Buttons */}
        <div className="flex gap-4">
          
          {/* Create Resume Button */}
          <button
            onClick={() => SetShowCreatedResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon className="size-11 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          {/* Upload Resume Button */}
          <button
            onClick={() => SetShowUploadedResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon className="size-11 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full" />
            <p className="text-sm group-hover:text-indigo-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>
        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

        {/* Display All Resume Cards */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allResumes.map((resume, index) => {
            const baseColor = colors[index % colors.length]; // Pick color based on index

            return (
              <button
                key={index}
                onClick={() => navigate(`/app/builder/${resume._id}`)} // Navigate to resume builder
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`,
                  borderColor: baseColor + "40",
                }}
              >
                {/* Resume Icon */}
                <FilePenIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: baseColor }}
                />

                {/* Resume Title */}
                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: baseColor }}
                >
                  {resume.title}
                </p>

                {/* Last Updated Date */}
                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: baseColor + "90" }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* Edit/Delete Icons (visible on hover) */}
                <div
                  onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking icons
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <Trash2Icon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                  <PencilIcon
                    onClick={() => {
                      SetEditResumeId(resume._id);
                      SetTitle(resume.title);
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* --------------------- Create Resume Modal --------------------- */}
        {showCreatedResume && (
          <form
            onSubmit={createResume}
            onClick={() => SetShowCreatedResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Create a Resume</h2>
              <input
                type="text"
                value={title}
                onChange={(e) => SetTitle(e.target.value)}
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Create Resume
              </button>

              {/* Close Button */}
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  SetShowCreatedResume(false);
                  SetTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* --------------------- Upload Resume Modal --------------------- */}
        {showUploadedResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => SetShowUploadedResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

              {/* Resume Title Input */}
              <input
                type="text"
                onChange={(e) => SetTitle(e.target.value)}
                value={title}
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              {/* File Upload Section */}
              <div>
                <label htmlFor="resume-input" className="block text-sm text-slate-700">
                  Select Resume File
                  <div className="flex flex-col items-center justify-center border group text-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-400 cursor-pointer transition-colors">
                    {resume ? (
                      <p className="text-green-700">{resume.name}</p>
                    ) : (
                      <>
                        <UploadIcon className="size-14 stroke-1" />
                        <p>Upload resume</p>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => SetResume(e.target.files[0])}
                />
              </div>

              {/* Upload Button */}
              <button disabled={isloading} className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                {isloading && <LoaderCircleIcon className="animate-spin size-4 text-white"/>}
                {isloading ? 'Uploading...' : 'Upload Resume'}

              </button>

              {/* Close Button */}
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  SetShowUploadedResume(false);
                  SetTitle("");
                }}
              />
            </div>
          </form>
        )}

        {/* --------------------- Edit Resume Title Modal --------------------- */}
        {editResumeId && (
          <form
            onSubmit={editTitle}
            onClick={() => SetEditResumeId("")}
            className="fixed inset-0 bg-black/70 backdrop-blur z-10 flex items-center justify-center"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">Edit Resume Title</h2>
              <input
                type="text"
                onChange={(e) => SetTitle(e.target.value)}
                value={title}
                placeholder="Enter Resume Title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />
              <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                Update
              </button>

              {/* Close Button */}
              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  SetEditResumeId("");
                  SetTitle("");
                }}
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Dashboard;
