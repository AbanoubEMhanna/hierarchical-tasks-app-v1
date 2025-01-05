import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Task } from '@prisma/client';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AppGateway.name);

  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('createTask')
  handleCreateTask(client: Socket, task: Task) {
    this.logger.log(`Task created by ${client.id}:`, task);
    // Broadcast to all clients except sender
    client.broadcast.emit('taskCreated', task);
    // Also send back to sender to confirm
    client.emit('taskCreated', task);
  }

  @SubscribeMessage('updateTask')
  handleUpdateTask(client: Socket, task: Task) {
    this.logger.log(`Task updated by ${client.id}:`, task);
    client.broadcast.emit('taskUpdated', task);
    client.emit('taskUpdated', task);
  }

  @SubscribeMessage('deleteTask')
  handleDeleteTask(client: Socket, taskId: number) {
    this.logger.log(`Task deleted by ${client.id}:`, taskId);
    client.broadcast.emit('taskDeleted', taskId);
    client.emit('taskDeleted', taskId);
  }
}
