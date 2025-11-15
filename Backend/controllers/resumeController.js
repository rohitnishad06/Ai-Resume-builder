const { Transform } = require("stream");
const imagekit = require("../configs/imagekit");
const resumeModel = require("../models/resumeModel");
const fs = require('fs')


// controller for creating a resume
// POST : /api/resumes/create

const createResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    //create new resume
    const newResume = await resumeModel.create({ userId, title });

    //return Success msg
    return res
      .status(201)
      .json({ msg: "Resume Created Successfully", resume: newResume });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// controller for deleting a resume
// POST : /api/resumes/delete

const deleteResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    await resumeModel.findOneAndDelete({ userId, _id: resumeId });

    //return Success msg
    return res.status(200).json({ msg: "Resume Deleted Successfully" });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// Get User Resume by id
// GET : /api/resume/get

const getResumeById = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId } = req.params;

    const resume = await resumeModel.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ msg: "Resume Not Found" });
    }

    resume.__v = undefined;
    resume.createdAt = undefined;
    resume.updatedAt = undefined;

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// Get User Resume by id Public
// GET : /api/resume/public

const getPublicResumeById = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await resumeModel.findOne({ public: true, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ msg: "Resume Not Found" });
    }

    return res.status(200).json({ resume });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

// controller for updating a resume
// GET : /api/resume/update

const updateResume = async (req, res) => {
  try {
    const userId = req.userId;
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy
    if(typeof resumeData === 'string'){
      resumeDataCopy = await JSON.parse(resumeData)
    }else{
      resumeDataCopy = structuredClone(resumeData)
    }

    if (image) {

      const imageBufferData = fs.createReadStream(image.path)

      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: 'resume.png',
        folder: 'user-resume',
        Transformation:{
          pre:'w-300, h-300, fo-face, z-0.75' + (removeBackground ? ',e-bgremove' : '')
        }
      });

      resumeDataCopy.personal_info.image = response.url
    
    }

    const resume = await resumeModel.findByIdAndUpdate(
      { userId, _id: resumeId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({ msg: "Saved Successfully", resume });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};


module.exports = {getPublicResumeById, updateResume, getResumeById, deleteResume, createResume}