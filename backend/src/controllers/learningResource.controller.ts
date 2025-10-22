import { Request, Response } from 'express';
import LearningResource, { ILearningResource } from '@/models/LearningResource.model';
import { AuthRequest } from '@/middleware/auth.middleware';

export const getAllResources = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category, difficulty, search, page = '1', limit = '10' } = req.query;
    const query: any = { isActive: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const total = await LearningResource.countDocuments(query);

    const resources = await LearningResource.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    return res.status(200).json({
      success: true,
      data: resources,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        itemsPerPage: parseInt(limit as string)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch resources', error: error.message });
  }
};

export const getResourceById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource || !resource.isActive) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Increment views asynchronously (not blocking response)
    resource.views = (resource.views || 0) + 1;
    resource.save().catch(console.error);

    return res.status(200).json({ success: true, data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch resource', error: error.message });
  }
};

export const createResource = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { title, description, category, url, tags, difficulty } = req.body;

    const resource = new LearningResource({
      title,
      description,
      category,
      url,
      tags,
      difficulty,
      createdBy: {
        userId: req.user?._id,
        userName: req.user?.username,
        email: req.user?.email,
      },
      isActive: true,
      views: 0,
      likes: 0,
    });

    await resource.save();

    return res.status(201).json({ success: true, message: 'Resource created', data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create resource', error: error.message });
  }
};

export const updateResource = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const { title, description, category, url, tags, difficulty } = req.body;

    const resource = await LearningResource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Check ownership is handled by middleware

    resource.title = title || resource.title;
    resource.description = description || resource.description;
    resource.category = category || resource.category;
    resource.url = url || resource.url;
    resource.tags = tags || resource.tags;
    resource.difficulty = difficulty || resource.difficulty;
    resource.updatedBy = {
      userId: req.user?._id,
      userName: req.user?.username,
      email: req.user?.email,
    };

    await resource.save();

    return res.status(200).json({ success: true, message: 'Resource updated', data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update resource', error: error.message });
  }
};

export const deleteResource = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    resource.isActive = false;
    await resource.save();

    return res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete resource', error: error.message });
  }
};

export const likeResource = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const resource = await LearningResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

    resource.likes = (resource.likes || 0) + 1;
    await resource.save();

    return res.status(200).json({ success: true, message: 'Resource liked', likes: resource.likes });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to like resource', error: error.message });
  }
};
