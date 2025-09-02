import { type User, type InsertUser, type TerminalSession, type InsertTerminalSession, type Command, type InsertCommand } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createTerminalSession(session: InsertTerminalSession): Promise<TerminalSession>;
  getTerminalSession(id: string): Promise<TerminalSession | undefined>;
  updateTerminalSession(id: string, sessionData: any): Promise<TerminalSession | undefined>;
  
  addCommand(command: InsertCommand): Promise<Command>;
  getSessionCommands(sessionId: string): Promise<Command[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private sessions: Map<string, TerminalSession>;
  private commands: Map<string, Command>;

  constructor() {
    this.users = new Map();
    this.sessions = new Map();
    this.commands = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createTerminalSession(insertSession: InsertTerminalSession): Promise<TerminalSession> {
    const id = randomUUID();
    const now = new Date();
    const session: TerminalSession = {
      ...insertSession,
      id,
      createdAt: now,
      updatedAt: now,
      userId: insertSession.userId || null,
      sessionData: insertSession.sessionData || {},
    };
    this.sessions.set(id, session);
    return session;
  }

  async getTerminalSession(id: string): Promise<TerminalSession | undefined> {
    return this.sessions.get(id);
  }

  async updateTerminalSession(id: string, sessionData: any): Promise<TerminalSession | undefined> {
    const session = this.sessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = {
      ...session,
      sessionData,
      updatedAt: new Date(),
    };
    this.sessions.set(id, updatedSession);
    return updatedSession;
  }

  async addCommand(insertCommand: InsertCommand): Promise<Command> {
    const id = randomUUID();
    const command: Command = {
      ...insertCommand,
      id,
      timestamp: new Date(),
      sessionId: insertCommand.sessionId || null,
      output: insertCommand.output || null,
    };
    this.commands.set(id, command);
    return command;
  }

  async getSessionCommands(sessionId: string): Promise<Command[]> {
    return Array.from(this.commands.values())
      .filter(cmd => cmd.sessionId === sessionId)
      .sort((a, b) => (a.timestamp?.getTime() || 0) - (b.timestamp?.getTime() || 0));
  }
}

export const storage = new MemStorage();
