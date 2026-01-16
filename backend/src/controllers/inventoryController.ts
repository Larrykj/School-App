import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createInventoryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      category,
      quantity,
      unit,
      minQuantity,
      location,
      supplier,
      purchaseDate,
      price,
      description,
    } = req.body;

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        quantity,
        unit,
        minQuantity,
        location,
        supplier,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        price,
        description,
      },
    });

    res.status(201).json({ message: 'Inventory item added successfully', item });
  } catch (error: any) {
    console.error('Create inventory item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInventoryItems = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, lowStock } = req.query;

    const where: any = {};
    if (category) where.category = category;

    const items = await prisma.inventoryItem.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    let filteredItems = items;
    if (lowStock === 'true') {
      filteredItems = items.filter((item) => item.quantity <= item.minQuantity);
    }

    res.json({ items: filteredItems });
  } catch (error: any) {
    console.error('Get inventory items error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const recordMovement = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId, type, quantity, reason } = req.body;
    const userId = (req as any).user?.userId;

    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    let newQuantity = item.quantity;
    if (type === 'IN') {
      newQuantity += quantity;
    } else if (type === 'OUT') {
      if (item.quantity < quantity) {
        res.status(400).json({ error: 'Insufficient quantity' });
        return;
      }
      newQuantity -= quantity;
    } else if (type === 'ADJUSTMENT') {
      newQuantity = quantity;
    }

    await prisma.inventoryMovement.create({
      data: {
        itemId,
        type,
        quantity,
        reason,
        userId,
      },
    });

    await prisma.inventoryItem.update({
      where: { id: itemId },
      data: { quantity: newQuantity },
    });

    res.json({ message: 'Movement recorded successfully' });
  } catch (error: any) {
    console.error('Record movement error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMovementHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemId } = req.query;

    const where: any = {};
    if (itemId) where.itemId = itemId;

    const movements = await prisma.inventoryMovement.findMany({
      where,
      include: {
        item: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.json({ movements });
  } catch (error: any) {
    console.error('Get movement history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

