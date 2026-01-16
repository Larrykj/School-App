import { Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';

export const createApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await ApplicationService.createApplication(req.body);
    
    res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error: any) {
    console.error('Create application error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, programId, intake, search } = req.query;
    
    const applications = await ApplicationService.getApplications({
      status: status as string,
      programId: programId as string,
      intake: intake as string,
      search: search as string,
    });
    
    res.json({ applications });
  } catch (error: any) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const application = await ApplicationService.getApplicationById(id);
    
    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    
    res.json({ application });
  } catch (error: any) {
    console.error('Get application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Basic update - you can expand this
    const application = await prisma?.application.update({
      where: { id },
      data: req.body,
      include: {
        program: true,
        student: true,
      },
    });
    
    res.json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error: any) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const application = await ApplicationService.submitApplication(id);
    
    res.json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error: any) {
    console.error('Submit application error:', error);
    res.status(400).json({ error: error.message || 'Failed to submit application' });
  }
};

export const reviewApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const reviewedBy = (req as any).user?.id || 'system';
    
    const application = await ApplicationService.reviewApplication(id, reviewedBy, notes);
    
    res.json({
      message: 'Application marked for review',
      application,
    });
  } catch (error: any) {
    console.error('Review application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const approveApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const reviewedBy = (req as any).user?.id || 'system';
    
    const result = await ApplicationService.approveApplication(id, reviewedBy);
    
    res.json({
      message: 'Application approved successfully',
      ...result,
    });
  } catch (error: any) {
    console.error('Approve application error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const rejectApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const reviewedBy = (req as any).user?.id || 'system';
    
    if (!reason) {
      res.status(400).json({ error: 'Rejection reason is required' });
      return;
    }
    
    const application = await ApplicationService.rejectApplication(id, reviewedBy, reason);
    
    res.json({
      message: 'Application rejected',
      application,
    });
  } catch (error: any) {
    console.error('Reject application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getApplicationStatistics = async (req: Request, res: Response): Promise<void> => {
  try {
    const statistics = await ApplicationService.getStatistics();
    
    res.json({ statistics });
  } catch (error: any) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Only allow deletion of DRAFT applications
    const application = await ApplicationService.getApplicationById(id);
    
    if (!application) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    
    if (application.status !== 'DRAFT') {
      res.status(400).json({ error: 'Only draft applications can be deleted' });
      return;
    }
    
    await prisma?.application.delete({
      where: { id },
    });
    
    res.json({ message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

