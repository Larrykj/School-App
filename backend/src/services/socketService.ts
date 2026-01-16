import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyToken } from '../utils/jwt';

export class SocketService {
  private static io: Server;

  /**
   * Initialize Socket.io server
   */
  static init(server: HttpServer): void {
    this.io = new Server(server, {
      cors: {
        origin: '*', // Configure based on environment
        methods: ['GET', 'POST'],
      },
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }
        const decoded = verifyToken(token);
        socket.data.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`User connected: ${socket.data.user.userId}`);

      // Join user-specific room
      socket.join(`user:${socket.data.user.userId}`);

      // Join role-specific room
      socket.join(`role:${socket.data.user.role}`);

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.data.user.userId}`);
      });
    });
  }

  /**
   * Send notification to specific user
   */
  static sendToUser(userId: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`user:${userId}`).emit(event, data);
    }
  }

  /**
   * Send notification to all users with a specific role
   */
  static sendToRole(role: string, event: string, data: any): void {
    if (this.io) {
      this.io.to(`role:${role}`).emit(event, data);
    }
  }

  /**
   * Broadcast to all connected users
   */
  static broadcast(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}

