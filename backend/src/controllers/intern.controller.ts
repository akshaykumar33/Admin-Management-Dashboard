import { Request, Response } from 'express';
import Intern, { IIntern } from '@/models/Intern.model';
import { AuthRequest } from '@/middleware/auth.middleware';

export const getAllInterns = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { status, department, search, page = '1', limit = '10' } = req.query;
    const query: any = { isActive: true };

    if (status) query['internshipDetails.status'] = status;
    if (department) query['internshipDetails.department'] = department;
    if (search) {
      query.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { 'personalInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Intern.countDocuments(query);

    const interns = await Intern.find(query)
      .sort({ createdAt: -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    return res.status(200).json({
      success: true,
      data: interns,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        itemsPerPage: parseInt(limit as string)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch interns', error: error.message });
  }
};

export const getInternById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern || !intern.isActive) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    return res.status(200).json({ success: true, data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch intern', error: error.message });
  }
};

export const createIntern = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // Only Admin allowed (middleware enforces)
    const internData = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const intern = new Intern(internData);
    await intern.save();

    return res.status(201).json({ success: true, message: 'Intern created', data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create intern', error: error.message });
  }
};

export const updateIntern = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // Admin only middleware applied
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    Object.assign(intern, req.body);
    intern.updatedBy = req.user?._id;

    await intern.save();

    return res.status(200).json({ success: true, message: 'Intern updated', data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update intern', error: error.message });
  }
};

export const deleteIntern = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // Soft delete
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    intern.isActive = false;
    await intern.save();

    return res.status(200).json({ success: true, message: 'Intern deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete intern', error: error.message });
  }
};

export const addDailyComment = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ success: false, message: 'Intern not found' });

    const comment = {
      date: req.body.date || new Date(),
      comment: req.body.comment,
      taskDescription: req.body.taskDescription,
      hoursWorked: req.body.hoursWorked,
      status: req.body.status,
      addedBy: {
        userId: req.user?._id,
        userName: req.user?.username,
        role: req.user?.role
      }
    };

    intern.dailyComments = intern.dailyComments || [];
    intern.dailyComments.push(comment);

    await intern.save();

    return res.status(201).json({ success: true, message: 'Daily comment added', data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add comment', error: error.message });
  }
};

export const addMeetingNote = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ success: false, message: 'Intern not found' });

    const note = {
      date: req.body.date || new Date(),
      title: req.body.title,
      agenda: req.body.agenda,
      notes: req.body.notes,
      attendees: req.body.attendees,
      actionItems: req.body.actionItems,
      nextMeetingDate: req.body.nextMeetingDate,
      addedBy: {
        userId: req.user?._id,
        userName: req.user?.username,
        role: req.user?.role
      }
    };

    intern.meetingNotes = intern.meetingNotes || [];
    intern.meetingNotes.push(note);

    await intern.save();

    return res.status(201).json({ success: true, message: 'Meeting note added', data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add meeting note', error: error.message });
  }
};

export const addProject = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    // Admin only middleware applied
    const intern = await Intern.findById(req.params.id);
    if (!intern) return res.status(404).json({ success: false, message: 'Intern not found' });

    intern.projects = intern.projects || [];
    intern.projects.push(req.body);

    await intern.save();

    return res.status(201).json({ success: true, message: 'Project added', data: intern });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add project', error: error.message });
  }
};
