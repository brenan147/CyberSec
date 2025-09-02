import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCommandSchema } from "@shared/schema";
import { z } from "zod";

// Advanced mod menu tools
const modMenuCommands = {
  'a1': {
    name: 'SQL Injection Tester',
    simulate: () => [
      '[MOD] ⚠️ ADVANCED MOD MENU - EDUCATIONAL ONLY ⚠️',
      '[SQL] Initializing SQL injection testing suite...',
      '[SQL] Target: example-db.com/login.php',
      '[SQL] Testing payload: \' OR 1=1--',
      '[SQL] Response: Authentication bypassed (SIMULATION)',
      '[SQL] Testing payload: UNION SELECT * FROM users--',
      '[SQL] Response: Database structure revealed (SIMULATION)',
      '[SQL] Vulnerability assessment: HIGH RISK (simulated)',
      '[WARNING] Real SQL injection is illegal and unethical',
      '[COMPLETE] Educational demonstration finished'
    ]
  },
  'a2': {
    name: 'Advanced Keylogger Sim',
    simulate: () => [
      '[MOD] Keystroke monitoring simulation activated',
      '[KEY] Initializing advanced keylogger module...',
      '[KEY] Target process: notepad.exe (SIMULATION)',
      '[KEY] Captured: "password123" (FAKE DATA)',
      '[KEY] Captured: "user@email.com" (FAKE DATA)',
      '[KEY] Screenshot taken: desktop_001.jpg (SIMULATED)',
      '[KEY] Data encrypted with AES-256',
      '[WARNING] Keylogging without consent is illegal',
      '[COMPLETE] Educational simulation complete'
    ]
  },
  'a3': {
    name: 'Social Engineering Kit',
    simulate: () => [
      '[MOD] Social engineering simulation framework',
      '[SE] Loading psychological manipulation tactics...',
      '[SE] Phishing template generator: ACTIVE (SIMULATION)',
      '[SE] Voice cloning module: READY (FAKE)',
      '[SE] Deepfake detection: 12 samples analyzed',
      '[SE] Trust exploitation vectors: 8 methods loaded',
      '[SE] Success rate estimation: 73% (THEORETICAL)',
      '[WARNING] Social engineering causes real harm to victims',
      '[COMPLETE] Educational awareness training finished'
    ]
  },
  'a4': {
    name: 'Zero-Day Exploit Scanner',
    simulate: () => [
      '[MOD] Zero-day vulnerability research mode',
      '[EXPLOIT] Scanning for unknown vulnerabilities...',
      '[EXPLOIT] CVE-2024-XXXX: Buffer overflow detected (SIMULATION)',
      '[EXPLOIT] Memory corruption vector found (FAKE)',
      '[EXPLOIT] Privilege escalation possible (THEORETICAL)',
      '[EXPLOIT] Payload generation: /bin/sh shellcode',
      '[EXPLOIT] Success probability: 89% (SIMULATED)',
      '[WARNING] Exploiting zero-days without permission is criminal',
      '[COMPLETE] Research simulation terminated'
    ]
  },
  'a5': {
    name: 'Ransomware Simulator',
    simulate: () => [
      '[MOD] ⚠️ RANSOMWARE EDUCATION MODULE ⚠️',
      '[RANSOM] Encryption simulation initializing...',
      '[RANSOM] Target files: *.docx, *.xlsx, *.pdf (SIMULATION)',
      '[RANSOM] AES-256 encryption: 1,247 files processed (FAKE)',
      '[RANSOM] Ransom note generated: YOUR_FILES_ARE_ENCRYPTED.txt',
      '[RANSOM] Bitcoin wallet: 1A2B3C4D5E6F... (EXAMPLE ONLY)',
      '[RANSOM] Decryption key hidden in secure vault',
      '[WARNING] Ransomware destroys lives and businesses',
      '[COMPLETE] Educational demonstration only'
    ]
  },
  'a6': {
    name: 'Advanced Persistent Threat',
    simulate: () => [
      '[MOD] APT simulation - Nation-state tactics',
      '[APT] Establishing covert command & control...',
      '[APT] Lateral movement: Domain controller accessed (FAKE)',
      '[APT] Data exfiltration: 2.3GB corporate secrets (SIMULATION)',
      '[APT] Persistence mechanism: Registry keys modified',
      '[APT] Anti-forensics: Event logs cleared',
      '[APT] Dormancy period: 127 days estimated',
      '[WARNING] APT attacks threaten national security',
      '[COMPLETE] Threat intelligence briefing finished'
    ]
  },
  'a7': {
    name: 'Cryptocurrency Miner',
    simulate: () => [
      '[MOD] Cryptojacking simulation framework',
      '[CRYPTO] Deploying stealth mining software...',
      '[CRYPTO] Target cryptocurrency: Monero (XMR)',
      '[CRYPTO] CPU utilization: 85% (background mining)',
      '[CRYPTO] Hash rate: 1,247 H/s (SIMULATED)',
      '[CRYPTO] Revenue generated: $0.23/day (FAKE)',
      '[CRYPTO] Detection evasion: Process name spoofing',
      '[WARNING] Cryptojacking steals electricity and computing power',
      '[COMPLETE] Resource hijacking awareness demo'
    ]
  },
  'a8': {
    name: 'IoT Botnet Controller',
    simulate: () => [
      '[MOD] IoT botnet simulation - Mirai variant',
      '[BOTNET] Scanning for vulnerable IoT devices...',
      '[BOTNET] Compromised devices: 15,847 cameras (SIMULATION)',
      '[BOTNET] Compromised devices: 8,923 routers (FAKE)',
      '[BOTNET] Command & control server: operational',
      '[BOTNET] DDoS capacity: 2.4 Tbps estimated',
      '[BOTNET] Propagation rate: 1,200 devices/hour',
      '[WARNING] IoT botnets enable massive cyber attacks',
      '[COMPLETE] Botnet awareness training complete'
    ]
  },
  'a9': {
    name: 'Dark Web Navigator',
    simulate: () => [
      '[MOD] Dark web exploration simulation',
      '[DARK] Initializing Tor browser environment...',
      '[DARK] Accessing .onion services (EDUCATIONAL URLS ONLY)',
      '[DARK] Marketplace scan: DarkMarket v3.2 (SIMULATION)',
      '[DARK] Available services: Stolen credentials, malware',
      '[DARK] Bitcoin mixer: 15.7 BTC processed (FAKE TRANSACTION)',
      '[DARK] Anonymity level: Advanced (Tor + VPN)',
      '[WARNING] Dark web contains illegal and harmful content',
      '[COMPLETE] Cybersecurity awareness session finished'
    ]
  }
};

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

// Account hacker simulations
const accountHackerCommands = {
  'roblox': {
    name: 'Roblox Account Breach',
    simulate: () => [
      '[ROBLOX] Initializing Roblox account penetration test...',
      '[ROBLOX] Target: user_example123@email.com',
      '[ROBLOX] Method: Credential stuffing attack',
      '[ROBLOX] Testing 15,000 leaked password combinations...',
      '[ROBLOX] Password found: "robloxfan2019"',
      '[ROBLOX] 2FA bypass: SIM swapping in progress...',
      '[ROBLOX] Account access: GRANTED',
      '[ROBLOX] Robux balance: 2,450 R$',
      '[ROBLOX] Premium subscription: Active until 2025-06-15',
      '[ROBLOX] Profile data extracted successfully',
      '[COMPLETE] Account breach completed'
    ]
  },
  'google': {
    name: 'Google Account Compromise',
    simulate: () => [
      '[GOOGLE] Target: business.user@company.com',
      '[GOOGLE] Method: OAuth token hijacking',
      '[GOOGLE] Phishing email sent: "Security Alert"',
      '[GOOGLE] User clicked malicious link',
      '[GOOGLE] Access token captured: ya29.a0Ae4lv...',
      '[GOOGLE] Gmail access: 12,847 emails scanned',
      '[GOOGLE] Google Drive: 2.3GB confidential files accessed',
      '[GOOGLE] Google Photos: 1,547 personal images accessed',
      '[GOOGLE] Location history: 2 years of tracking data',
      '[GOOGLE] Contact list: 847 contacts extracted',
      '[COMPLETE] Account compromise successful'
    ]
  },
  'facebook': {
    name: 'Facebook Account Takeover',
    simulate: () => [
      '[FACEBOOK] Target: social_butterfly_2024',
      '[FACEBOOK] Method: Social engineering + password reset',
      '[FACEBOOK] Phone number discovered: +1-555-0123',
      '[FACEBOOK] Security questions answered via OSINT',
      '[FACEBOOK] Password reset email intercepted',
      '[FACEBOOK] Account access: GRANTED',
      '[FACEBOOK] Friends list: 847 contacts exposed',
      '[FACEBOOK] Private messages: 5 years of conversations',
      '[FACEBOOK] Photo metadata: Location tracking enabled',
      '[FACEBOOK] Business pages: 3 managed pages accessed',
      '[COMPLETE] Social media takeover complete'
    ]
  },
  'snapchat': {
    name: 'Snapchat Account Infiltration',
    simulate: () => [
      '[SNAPCHAT] Target: snap_user_cool',
      '[SNAPCHAT] Method: SIM swapping + phone verification bypass',
      '[SNAPCHAT] Phone carrier social engineering successful',
      '[SNAPCHAT] SMS verification code: 847295',
      '[SNAPCHAT] Account recovery: SUCCESSFUL',
      '[SNAPCHAT] Snap Map location: Last seen 2.1 miles away',
      '[SNAPCHAT] Saved photos: 127 images in memories',
      '[SNAPCHAT] Friend streaks: 15 active conversations',
      '[SNAPCHAT] Snap score: 45,672',
      '[SNAPCHAT] Chat history: 2 years of conversations extracted',
      '[COMPLETE] Multimedia account compromised'
    ]
  },
  'tiktok': {
    name: 'TikTok Account Hijacking',
    simulate: () => [
      '[TIKTOK] Target: @viral_creator_2024',
      '[TIKTOK] Method: Malware keylogger + session hijacking',
      '[TIKTOK] Infected device: iPhone 15 Pro',
      '[TIKTOK] Login credentials captured',
      '[TIKTOK] Creator Fund balance: $2,847.23',
      '[TIKTOK] Follower count: 847K followers accessed',
      '[TIKTOK] Private videos: 23 drafts accessed',
      '[TIKTOK] Analytics data: Demographics and earnings',
      '[TIKTOK] Brand partnerships: $15K pending payments',
      '[TIKTOK] Content monetization: Full access granted',
      '[COMPLETE] Creator account hijacked'
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
        output = "Available commands: 1-10, clear, help, modmenu\nUse the menu on the left for detailed descriptions";
      } else if (command === "modmenu") {
        output = "[MOD] ⚠️ ADVANCED MOD MENU ACTIVATED ⚠️\n[MOD] Warning: These are advanced educational simulations\n[MOD] Commands: a1-a9 or use the Advanced Mod Menu interface\n[MOD] Type 'help' to return to standard commands\n[MOD] Educational purposes only - Real usage is illegal!";
      } else if (command === "10" || command === "accounthacker") {
        output = "[ACCOUNT] SOCIAL MEDIA ACCOUNT HACKER MENU\n[ACCOUNT] Available platforms:\n[ACCOUNT] • roblox - Roblox gaming platform\n[ACCOUNT] • google - Google/Gmail accounts\n[ACCOUNT] • facebook - Facebook/Meta social media\n[ACCOUNT] • snapchat - Snapchat multimedia app\n[ACCOUNT] • tiktok - TikTok content platform\n[ACCOUNT] Type the platform name to execute breach";
      } else if (commands[command as keyof typeof commands]) {
        const commandObj = commands[command as keyof typeof commands];
        output = commandObj.simulate().join('\n');
      } else if (modMenuCommands[command as keyof typeof modMenuCommands]) {
        const commandObj = modMenuCommands[command as keyof typeof modMenuCommands];
        output = commandObj.simulate().join('\n');
      } else if (accountHackerCommands[command as keyof typeof accountHackerCommands]) {
        const commandObj = accountHackerCommands[command as keyof typeof accountHackerCommands];
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
