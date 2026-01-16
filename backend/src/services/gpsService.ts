import prisma from '../utils/prisma';

export interface GPSLocation {
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  accuracy?: number;
  timestamp: Date;
}

export class GPSService {
  /**
   * Update vehicle location
   */
  static async updateVehicleLocation(
    vehicleId: string,
    location: GPSLocation
  ): Promise<void> {
    try {
      // Find transport by vehicle number
      const transport = await prisma.transport.findUnique({
        where: { id: vehicleId },
      });

      if (!transport) {
        throw new Error('Vehicle not found');
      }

      // Create tracking record
      // Store location as JSON string since schema uses single location field
      await prisma.transportTracking.create({
        data: {
          routeId: vehicleId, // Note: Using routeId as vehicleId for now
          location: JSON.stringify(location),
          status: 'IN_TRANSIT',
          notes: `GPS update at ${new Date(location.timestamp).toLocaleString()}`,
        },
      });

      // Keep only last 100 records per vehicle (for performance)
      const records = await prisma.transportTracking.findMany({
        where: { routeId: vehicleId },
        orderBy: { createdAt: 'desc' },
        skip: 100,
      });

      if (records.length > 0) {
        const idsToDelete = records.map((r) => r.id);
        await prisma.transportTracking.deleteMany({
          where: {
            id: { in: idsToDelete },
          },
        });
      }
    } catch (error) {
      console.error('Failed to update vehicle location:', error);
      throw error;
    }
  }

  /**
   * Get current location of a vehicle
   */
  static async getCurrentLocation(vehicleId: string): Promise<GPSLocation | null> {
    try {
      const latestTracking = await prisma.transportTracking.findFirst({
        where: { routeId: vehicleId },
        orderBy: { createdAt: 'desc' },
      });

      if (!latestTracking || !latestTracking.location) {
        return null;
      }

      // Parse location from JSON string
      try {
        const locationData = JSON.parse(latestTracking.location);
        return locationData as GPSLocation;
      } catch (parseError) {
        console.error('Failed to parse location data:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * Get vehicle tracking history
   */
  static async getTrackingHistory(
    vehicleId: string,
    startTime?: Date,
    endTime?: Date
  ): Promise<GPSLocation[]> {
    try {
      const where: any = { routeId: vehicleId };

      if (startTime || endTime) {
        where.createdAt = {};
        if (startTime) where.createdAt.gte = startTime;
        if (endTime) where.createdAt.lte = endTime;
      }

      const tracking = await prisma.transportTracking.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        take: 1000, // Limit to 1000 records
      });

      return tracking.map((t) => {
        if (!t.location) return null;
        try {
          const locationData = JSON.parse(t.location);
          return locationData as GPSLocation;
        } catch {
          return null;
        }
      }).filter((loc): loc is GPSLocation => loc !== null);
    } catch (error) {
      console.error('Failed to get tracking history:', error);
      return [];
    }
  }

  /**
   * Get all active vehicles with their current locations
   */
  static async getAllActiveVehicles(): Promise<any[]> {
    try {
      const transports = await prisma.transport.findMany({
        include: {
          _count: {
            select: { students: true },
          },
        },
      });

      const vehiclesWithLocation = await Promise.all(
        transports.map(async (transport) => {
          const location = await this.getCurrentLocation(transport.id);
          return {
            id: transport.id,
            routeName: transport.routeName,
            vehicleNumber: transport.vehicleNumber,
            driverName: transport.driverName,
            driverPhone: transport.driverPhone,
            capacity: transport.capacity,
            studentCount: transport._count.students,
            currentLocation: location,
            isActive: location ? this.isLocationRecent(location.timestamp) : false,
          };
        })
      );

      return vehiclesWithLocation;
    } catch (error) {
      console.error('Failed to get active vehicles:', error);
      return [];
    }
  }

  /**
   * Check if a location timestamp is recent (within last 5 minutes)
   */
  private static isLocationRecent(timestamp: Date): boolean {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    return timestamp >= fiveMinutesAgo;
  }

  /**
   * Calculate estimated arrival time based on current location and speed
   * (Simplified version - in production you'd use a proper routing API)
   */
  static async estimateArrival(
    vehicleId: string,
    destinationLat: number,
    destinationLng: number
  ): Promise<number | null> {
    try {
      const location = await this.getCurrentLocation(vehicleId);

      if (!location || !location.speed || location.speed === 0) {
        return null;
      }

      // Calculate distance using Haversine formula
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        destinationLat,
        destinationLng
      );

      // Estimated time in minutes (distance in km / speed in km/h * 60)
      const estimatedMinutes = (distance / location.speed) * 60;

      return Math.round(estimatedMinutes);
    } catch (error) {
      console.error('Failed to estimate arrival:', error);
      return null;
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   * Returns distance in kilometers
   */
  private static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

