import { Request, Response } from "express";
import { Op, where } from "sequelize";
const {JobTypes} = require("../../models"); // adjust path if needed


export const createJobTypeController = async (req: Request, res: Response) => {
  try {
    const { name, key, description, image} = req.body;
  if(!name) return res.status(400).json({message: "Email is required."})
  if(!key) return res.status(400).json({message: "Password is required."})
  if(!description) return res.status(400).json({message: "Description is required."})
  if(!image) return res.status(400).json({message: "Image is required."})

    const prevJobType = await JobTypes.findOne({
  where: {
    [Op.or]: [
      { name: name },
      { key: key }
    ]
  }
});

if(prevJobType) return res.status(400).json({message: "Job type exist."})

    // Create the job type
    const jobType = await JobTypes.create({
      name,
      key,
      description,
      image
    });

    
    return res.status(201).json({ message: 'Job type created successfully.', data: {
    name: jobType.id,
    key: jobType.firstName,
    createdAt: jobType.createdAt,
    updatedAt: jobType.updatedAt
  } });
  } catch (error: any) {
    console.error("Error create job type controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const getJobTypeController = async (req: Request, res: Response) => {
  try {

    const prevJobType = await JobTypes.findAll();

    return res.status(200).json({ status: true, data: prevJobType });
  } catch (error: any) {
    console.error("Error get job type controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateJobTypeController = async (req: Request, res: Response) => {
  try {
    const { key } = req.params; // search by key
    const { name, description, image } = req.body;
    

    if (!key) {
      return res.status(400).json({ message: "Key is required to update job type." });
    }

    // Find job type by key
    const jobType = await JobTypes.findOne({ where: { key } });
    if (!jobType) {
      return res.status(404).json({ message: "Job type not found." });
    }

    // Update only fields provided
    if (name) jobType.name = name;
    if (description) jobType.description = description;
    if (image) jobType.image = image;

    await jobType.save();

    return res.status(200).json({
      message: "Job type updated successfully.",
      data: {
        id: jobType.id,
        name: jobType.name,
        key: jobType.key,
        image: jobType.image,
        description: jobType.description,
        createdAt: jobType.createdAt,
        updatedAt: jobType.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Error update job type controller:", error);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteJobTypeController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // delete by id

    if (!id) {
      return res.status(400).json({ message: "ID is required to delete job type." });
    }

    // Find job type by id
    const jobType = await JobTypes.findOne({ where: { id } });
    if (!jobType) {
      return res.status(404).json({ message: "Job type not found." });
    }

    await jobType.destroy();

    return res.status(200).json({
      message: "Job type deleted successfully.",
      deletedId: id,
    });
  } catch (error: any) {
    console.error("Error delete job type controller:", error);
    return res.status(500).json({ message: error.message });
  }
};
