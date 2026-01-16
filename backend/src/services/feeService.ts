import prisma from '../utils/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export class FeeService {
  /**
   * Calculate student fee balance
   */
  static async calculateBalance(studentId: string): Promise<{
    totalDue: number;
    totalPaid: number;
    balance: number;
    carryover: number;
  }> {
    const studentFees = await prisma.studentFee.findMany({
      where: { studentId },
      include: {
        feeStructure: true,
      },
    });

    let totalDue = 0;
    let totalPaid = 0;
    let carryover = 0;

    for (const fee of studentFees) {
      const feeAmount = Number(fee.amount);
      const paidAmount = Number(fee.paidAmount);
      const feeCarryover = Number(fee.carryover);

      totalDue += feeAmount;
      totalPaid += paidAmount;
      carryover += feeCarryover;
    }

    const balance = totalDue - totalPaid - carryover;

    return {
      totalDue,
      totalPaid,
      balance: balance > 0 ? balance : 0,
      carryover,
    };
  }

  /**
   * Apply payment to student fees
   */
  static async applyPayment(
    studentId: string,
    amount: number,
    paymentId: string
  ): Promise<void> {
    const studentFees = await prisma.studentFee.findMany({
      where: {
        studentId,
        isPaid: false,
      },
      orderBy: {
        dueDate: 'asc', // Pay oldest fees first
      },
    });

    let remainingAmount = amount;

    for (const fee of studentFees) {
      if (remainingAmount <= 0) break;

      const feeBalance = Number(fee.amount) - Number(fee.paidAmount) - Number(fee.carryover);
      
      if (feeBalance > 0) {
        const paymentAmount = Math.min(remainingAmount, feeBalance);
        const newPaidAmount = Number(fee.paidAmount) + paymentAmount;
        const isFullyPaid = newPaidAmount + Number(fee.carryover) >= Number(fee.amount);

        // Handle overpayment
        let overpayment = 0;
        if (newPaidAmount + Number(fee.carryover) > Number(fee.amount)) {
          overpayment = newPaidAmount + Number(fee.carryover) - Number(fee.amount);
        }

        await prisma.studentFee.update({
          where: { id: fee.id },
          data: {
            paidAmount: new Decimal(newPaidAmount),
            balance: new Decimal(Math.max(0, feeBalance - paymentAmount)),
            isPaid: isFullyPaid,
            carryover: new Decimal(Number(fee.carryover) + overpayment),
          },
        });

        // Link payment to fee item
        await prisma.paymentFeeItem.create({
          data: {
            paymentId,
            studentFeeId: fee.id,
            amount: new Decimal(paymentAmount),
          },
        });

        remainingAmount -= paymentAmount;

        // If there's remaining amount after paying this fee, it becomes carryover
        if (remainingAmount > 0 && isFullyPaid) {
          // Apply remaining as carryover to next fee
          const nextFee = studentFees.find(f => f.id !== fee.id && !f.isPaid);
          if (nextFee) {
            await prisma.studentFee.update({
              where: { id: nextFee.id },
              data: {
                carryover: new Decimal(Number(nextFee.carryover) + remainingAmount),
              },
            });
            remainingAmount = 0;
          }
        }
      }
    }
  }

  /**
   * Assign fees to a student
   */
  static async assignFees(
    studentId: string,
    feeStructureIds: string[],
    term: string,
    academicYear: string
  ): Promise<void> {
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        id: { in: feeStructureIds },
        isActive: true,
      },
    });

    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 1); // Due in 1 month

    for (const feeStructure of feeStructures) {
      await prisma.studentFee.create({
        data: {
          studentId,
          feeStructureId: feeStructure.id,
          amount: feeStructure.amount,
          dueDate,
        },
      });
    }
  }

  /**
   * Get class-wide fee report
   */
  static async getClassFeeReport(classId: string) {
    const students = await prisma.student.findMany({
      where: { classId, isActive: true },
      include: {
        fees: {
          include: {
            feeStructure: true,
          },
        },
      },
    });

    const report = students.map((student) => {
      const totalDue = student.fees.reduce((sum, fee) => sum + Number(fee.amount), 0);
      const totalPaid = student.fees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0);
      const balance = totalDue - totalPaid;

      return {
        studentId: student.id,
        admissionNumber: student.admissionNumber,
        name: `${student.firstName} ${student.lastName}`,
        totalDue,
        totalPaid,
        balance,
        isFullyPaid: balance <= 0,
      };
    });

    return report;
  }

  /**
   * Get end-of-term fee summary
   */
  static async getTermFeeSummary(term: string, academicYear: string) {
    const feeStructures = await prisma.feeStructure.findMany({
      where: {
        term,
        academicYear,
        isActive: true,
      },
    });

    const summary = {
      term,
      academicYear,
      totalExpected: 0,
      totalCollected: 0,
      outstanding: 0,
      byFeeType: [] as any[],
    };

    for (const feeStructure of feeStructures) {
      const studentFees = await prisma.studentFee.findMany({
        where: {
          feeStructureId: feeStructure.id,
        },
      });

      const expected = studentFees.reduce((sum, fee) => sum + Number(fee.amount), 0);
      const collected = studentFees.reduce((sum, fee) => sum + Number(fee.paidAmount), 0);
      const outstanding = expected - collected;

      summary.totalExpected += expected;
      summary.totalCollected += collected;
      summary.outstanding += outstanding;

      summary.byFeeType.push({
        feeType: feeStructure.name,
        expected,
        collected,
        outstanding,
      });
    }

    return summary;
  }
}

