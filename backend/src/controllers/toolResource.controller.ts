import { Request, Response } from 'express';
import ToolResource, { IToolResource } from '@/models/ToolResource.model';
import { AuthRequest } from '@/middleware/auth.middleware';

export const getAllTools = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { category, pricing, search, page = '1', limit = '10' } = req.query;
    const query: any = { isActive: true };

    if (category) query.category = category;
    if (pricing) query.pricing = pricing;
    if (search) {
      query.$or = [
        { toolName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const total = await ToolResource.countDocuments(query);

    const tools = await ToolResource.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    return res.status(200).json({
      success: true,
      data: tools,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        itemsPerPage: parseInt(limit as string)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch tools', error: error.message });
  }
};

export const getToolById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const tool = await ToolResource.findById(req.params.id);
    if (!tool || !tool.isActive) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    return res.status(200).json({ success: true, data: tool });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch tool', error: error.message });
  }
};

export const createTool = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const toolData = {
      ...req.body,
      createdBy: {
        userId: req.user?._id,
        userName: req.user?.username,
        email: req.user?.email
      }
    };

    const tool = new ToolResource(toolData);
    await tool.save();

    return res.status(201).json({ success: true, message: 'Tool created', data: tool });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create tool', error: error.message });
  }
};

export const updateTool = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const tool = await ToolResource.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    // Ownership check done in middleware

    Object.assign(tool, req.body);
    tool.updatedBy = {
      userId: req.user?._id,
      userName: req.user?.username,
      email: req.user?.email
    };

    await tool.save();

    return res.status(200).json({ success: true, message: 'Tool updated', data: tool });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update tool', error: error.message });
  }
};

export const deleteTool = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const tool = await ToolResource.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }

    tool.isActive = false;
    await tool.save();

    return res.status(200).json({ success: true, message: 'Tool deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete tool', error: error.message });
  }
};
