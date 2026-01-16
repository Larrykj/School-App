import { FeeService } from '../../services/feeService';
import { mockPrisma } from '../setup';
import { Decimal } from '@prisma/client/runtime/library';

// Mock Prisma
jest.mock('../../utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

describe('FeeService', () => {
  describe('calculateBalance', () => {
    it('should calculate correct balance when payments exist', async () => {
      const mockStudentFees = [
        {
          id: '1',
          amount: new Decimal(10000),
          paidAmount: new Decimal(6000),
          carryover: new Decimal(0),
          feeStructure: { name: 'Tuition' },
        },
        {
          id: '2',
          amount: new Decimal(5000),
          paidAmount: new Decimal(5000),
          carryover: new Decimal(0),
          feeStructure: { name: 'Lunch' },
        },
      ];

      mockPrisma.studentFee.findMany.mockResolvedValue(mockStudentFees);

      const result = await FeeService.calculateBalance('student-1');

      expect(result).toEqual({
        totalDue: 15000,
        totalPaid: 11000,
        balance: 4000,
        carryover: 0,
      });
    });

    it('should return zero balance when fully paid', async () => {
      const mockStudentFees = [
        {
          id: '1',
          amount: new Decimal(10000),
          paidAmount: new Decimal(10000),
          carryover: new Decimal(0),
          feeStructure: { name: 'Tuition' },
        },
      ];

      mockPrisma.studentFee.findMany.mockResolvedValue(mockStudentFees);

      const result = await FeeService.calculateBalance('student-1');

      expect(result.balance).toBe(0);
    });

    it('should handle carryover correctly', async () => {
      const mockStudentFees = [
        {
          id: '1',
          amount: new Decimal(10000),
          paidAmount: new Decimal(8000),
          carryover: new Decimal(1000),
          feeStructure: { name: 'Tuition' },
        },
      ];

      mockPrisma.studentFee.findMany.mockResolvedValue(mockStudentFees);

      const result = await FeeService.calculateBalance('student-1');

      expect(result.carryover).toBe(1000);
      expect(result.balance).toBe(1000); // 10000 - 8000 - 1000
    });
  });

  describe('applyPayment', () => {
    it('should apply payment to oldest fees first', async () => {
      const mockStudentFees = [
        {
          id: '1',
          amount: new Decimal(10000),
          paidAmount: new Decimal(0),
          carryover: new Decimal(0),
          dueDate: new Date('2024-01-01'),
          isPaid: false,
        },
        {
          id: '2',
          amount: new Decimal(5000),
          paidAmount: new Decimal(0),
          carryover: new Decimal(0),
          dueDate: new Date('2024-02-01'),
          isPaid: false,
        },
      ];

      mockPrisma.studentFee.findMany.mockResolvedValue(mockStudentFees);
      mockPrisma.studentFee.update.mockResolvedValue({});
      mockPrisma.paymentFeeItem.create.mockResolvedValue({});

      await FeeService.applyPayment('student-1', 12000, 'payment-1');

      // Should update first fee completely
      expect(mockPrisma.studentFee.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '1' },
          data: expect.objectContaining({
            paidAmount: new Decimal(10000),
            isPaid: true,
          }),
        })
      );

      // Should update second fee partially
      expect(mockPrisma.studentFee.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: '2' },
          data: expect.objectContaining({
            paidAmount: new Decimal(2000),
            isPaid: false,
          }),
        })
      );
    });
  });

  describe('getClassFeeReport', () => {
    it('should generate accurate class-wide fee report', async () => {
      const mockStudents = [
        {
          id: '1',
          admissionNumber: 'ADM001',
          firstName: 'John',
          lastName: 'Doe',
          fees: [
            { amount: new Decimal(10000), paidAmount: new Decimal(6000) },
            { amount: new Decimal(5000), paidAmount: new Decimal(5000) },
          ],
        },
        {
          id: '2',
          admissionNumber: 'ADM002',
          firstName: 'Jane',
          lastName: 'Smith',
          fees: [
            { amount: new Decimal(10000), paidAmount: new Decimal(10000) },
          ],
        },
      ];

      mockPrisma.student.findMany.mockResolvedValue(mockStudents);

      const report = await FeeService.getClassFeeReport('class-1');

      expect(report).toHaveLength(2);
      expect(report[0]).toMatchObject({
        name: 'John Doe',
        totalDue: 15000,
        totalPaid: 11000,
        balance: 4000,
        isFullyPaid: false,
      });
      expect(report[1]).toMatchObject({
        name: 'Jane Smith',
        totalDue: 10000,
        totalPaid: 10000,
        balance: 0,
        isFullyPaid: true,
      });
    });
  });
});

