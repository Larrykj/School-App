import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createTransportRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeName, pickupPoints, vehicleId, driverId, fee } = req.body;

    const route = await prisma.transportRoute.create({
      data: {
        routeName,
        pickupPoints: JSON.stringify(pickupPoints),
        vehicleId,
        driverId,
        fee,
      },
    });

    res.status(201).json({ message: 'Transport route created successfully', route });
  } catch (error: any) {
    console.error('Create transport route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransportRoutes = async (req: Request, res: Response): Promise<void> => {
  try {
    const routes = await prisma.transportRoute.findMany({
      include: {
        vehicle: true,
        _count: {
          select: { assignments: true },
        },
      },
      orderBy: { routeName: 'asc' },
    });

    // Parse pickupPoints JSON
    const parsedRoutes = routes.map((route) => ({
      ...route,
      pickupPoints: JSON.parse(route.pickupPoints),
    }));

    res.json({ routes: parsedRoutes });
  } catch (error: any) {
    console.error('Get transport routes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const assignStudentToRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, routeId, pickupPoint } = req.body;

    const assignment = await prisma.transportAssignment.create({
      data: {
        studentId,
        routeId,
        pickupPoint,
      },
    });

    res.status(201).json({ message: 'Student assigned to route successfully', assignment });
  } catch (error: any) {
    console.error('Assign student to route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const trackTransport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId, location, status, notes } = req.body;

    const tracking = await prisma.transportTracking.create({
      data: {
        routeId,
        location,
        status,
        notes,
      },
    });

    res.status(201).json({ message: 'Transport tracked successfully', tracking });
  } catch (error: any) {
    console.error('Track transport error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTransportTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { routeId, date } = req.query;

    const where: any = {};
    if (routeId) where.routeId = routeId;
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const tracking = await prisma.transportTracking.findMany({
      where,
      include: {
        route: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json({ tracking });
  } catch (error: any) {
    console.error('Get transport tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

