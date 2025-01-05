import { io, Socket } from 'socket.io-client';

// Create socket instance
export const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL as string, {
  autoConnect: false,
  withCredentials: true,
  transports: ['websocket', 'polling'], // Explicitly specify transports
});

// Add connection event handlers
socket.on('connect', () => {
  console.log('Socket connected with ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Socket disconnected');
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});

// Debug events
socket.onAny((event, ...args) => {
  console.log('Socket event:', event, args);
}); 