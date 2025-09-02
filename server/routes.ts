import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommandSchema } from "@shared/schema";
import { z } from "zod";

const commands = {
  '1': {
    name: 'IP Finder/Tracker',
    simulate: () => [
      '[INFO] Initializing IP tracking module...',
      '[SCAN] Target IP: 192.168.1.100',
      '[TRACE] Hop 1: 192.168.1.1 (1ms)',
      '[TRACE] Hop 2: 10.0.0.1 (15ms)',
      '[TRACE] Hop 3: 203.0.113.1 (45ms)',
      '[RESULT] Location: San Francisco, CA, US',
      '[RESULT] ISP: Example Internet Services',
      '[COMPLETE] IP trace finished'
    ]
  },
  '2': {
    name: 'Port Scanner',
    simulate: () => [
      '[INFO] Starting port scan...',
      '[SCAN] Target: 192.168.1.100',
      '[SCAN] Port 22/tcp   OPEN    SSH',
      '[SCAN] Port 80/tcp   OPEN    HTTP',
      '[SCAN] Port 443/tcp  OPEN    HTTPS',
      '[SCAN] Port 3389/tcp CLOSED  RDP',
      '[SCAN] Port 21/tcp   FILTERED FTP',
      '[COMPLETE] Scan finished - 3 open ports found'
    ]
  },
  '3': {
    name: 'DDoS Attack Simulator',
    simulate: () => [
      '[WARNING] ⚠️  DDoS SIMULATION MODE ONLY ⚠️',
      '[WARNING] This is for educational purposes only',
      '[INFO] Initializing simulated attack vectors...',
      '[SIM] TCP SYN flood simulation started',
      '[SIM] UDP flood simulation started',
      '[SIM] HTTP request flood simulation started',
      '[SIM] Attack vectors: 1,000 simulated connections',
      '[SIM] Target response time: SIMULATED SLOWDOWN',
      '[WARNING] Real attacks are illegal and unethical',
      '[COMPLETE] Educational simulation finished'
    ]
  },
  '4': {
    name: 'Network Reconnaissance',
    simulate: () => [
      '[INFO] Starting reconnaissance scan...',
      '[RECON] Discovering network topology...',
      '[RECON] Found gateway: 192.168.1.1',
      '[RECON] Found hosts: 192.168.1.100-110',
      '[RECON] DNS servers: 8.8.8.8, 1.1.1.1',
      '[RECON] Network range: 192.168.1.0/24',
      '[RECON] Active hosts: 8 devices found',
      '[COMPLETE] Reconnaissance finished'
    ]
  },
  '5': {
    name: 'Traffic Analysis',
    simulate: () => [
      '[INFO] Monitoring network traffic...',
      '[TRAFFIC] Capturing packets on interface eth0',
      '[TRAFFIC] HTTP traffic: 45% (1.2MB/s)',
      '[TRAFFIC] HTTPS traffic: 40% (980KB/s)',
      '[TRAFFIC] DNS queries: 10% (45 queries/min)',
      '[TRAFFIC] Other protocols: 5%',
      '[TRAFFIC] Peak bandwidth: 2.8MB/s',
      '[COMPLETE] Traffic analysis complete'
    ]
  },
  '6': {
    name: 'Vulnerability Scanner',
    simulate: () => [
      '[INFO] Starting vulnerability assessment...',
      '[VULN] Checking for common vulnerabilities...',
      '[VULN] SSL/TLS configuration: SECURE',
      '[VULN] Outdated software: 2 packages found',
      '[VULN] Weak passwords: NONE DETECTED',
      '[VULN] Open ports: 3 services exposed',
      '[VULN] Security score: 7.5/10',
      '[COMPLETE] Vulnerability scan finished'
    ]
  },
  '7': {
    name: 'Packet Analyzer',
    simulate: () => [
      '[INFO] Deep packet inspection initiated...',
      '[PACKET] Analyzing protocol headers...',
      '[PACKET] TCP packets: 1,247 (78.2%)',
      '[PACKET] UDP packets: 298 (18.7%)',
      '[PACKET] ICMP packets: 49 (3.1%)',
      '[PACKET] Malformed packets: 0',
      '[PACKET] Encryption: 85% encrypted traffic',
      '[COMPLETE] Packet analysis finished'
    ]
  },
  '8': {
    name: 'Network Mapper',
    simulate: () => [
      '[INFO] Comprehensive network mapping...',
      '[NMAP] Host discovery phase...',
      '[NMAP] Service detection phase...',
      '[NMAP] OS fingerprinting...',
      '[NMAP] Found: Windows 10 (192.168.1.100)',
      '[NMAP] Found: Ubuntu Server (192.168.1.101)',
      '[NMAP] Found: iPhone (192.168.1.102)',
      '[COMPLETE] Network map generated'
    ]
  },
  '9': {
    name: 'System Info',
    simulate: () => [
      '[INFO] Gathering system information...',
      '[SYS] OS: CyberSec Linux v2.4.1',
      '[SYS] Kernel: 5.15.0-cyber',
      '[SYS] CPU: Intel i7-12700K (16 cores)',
      '[SYS] RAM: 32GB DDR4 (18.2GB available)',
      '[SYS] Storage: 1TB NVMe SSD (742GB free)',
      '[SYS] Network: Gigabit Ethernet',
      '[SYS] Uptime: 2 days, 14 hours, 23 minutes'
    ]
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new terminal session
  app.post("/api/terminal/session", async (req, res) => {
    try {
      const session = await storage.createTerminalSession({
        userId: null,
        sessionData: { startTime: new Date() },
      });
      res.json(session);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Execute a command
  app.post("/api/terminal/execute", async (req, res) => {
    try {
      const { sessionId, command } = req.body;
      
      if (!sessionId || !command) {
        return res.status(400).json({ error: "Missing sessionId or command" });
      }

      let output = "";
      
      if (command === "clear") {
        output = "[SYSTEM] Terminal cleared";
      } else if (command === "help") {
        output = "Available commands: 1-9, clear, help\nUse the menu on the left for detailed descriptions";
      } else if (commands[command as keyof typeof commands]) {
        const commandObj = commands[command as keyof typeof commands];
        output = commandObj.simulate().join('\n');
      } else if (command.trim()) {
        output = `[ERROR] Unknown command: ${command}. Type 'help' for available commands.`;
      }

      const savedCommand = await storage.addCommand({
        sessionId,
        command,
        output,
      });

      res.json(savedCommand);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get session history
  app.get("/api/terminal/session/:sessionId/history", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const commands = await storage.getSessionCommands(sessionId);
      res.json(commands);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
