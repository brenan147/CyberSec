import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TerminalLine {
  id: string;
  content: string;
  timestamp: Date;
  isCommand?: boolean;
}

interface MenuCommand {
  id: string;
  name: string;
  description: string;
  category: string;
  isWarning?: boolean;
}

const menuCommands: MenuCommand[] = [
  {
    id: "1",
    name: "IP Finder/Tracker",
    description: "Locate and trace IP addresses",
    category: "TRACE",
  },
  {
    id: "2",
    name: "Port Scanner",
    description: "Discover open ports and services",
    category: "SCAN",
  },
  {
    id: "3",
    name: "DDoS Attack Simulator",
    description: "⚠️ Simulation only - Educational",
    category: "DDOS",
    isWarning: true,
  },
  {
    id: "4",
    name: "Network Reconnaissance",
    description: "Gather network intelligence",
    category: "RECON",
  },
  {
    id: "5",
    name: "Traffic Analysis",
    description: "Monitor network traffic patterns",
    category: "TRAFFIC",
  },
  {
    id: "6",
    name: "Vulnerability Scanner",
    description: "Identify security weaknesses",
    category: "VULN",
  },
  {
    id: "7",
    name: "Packet Analyzer",
    description: "Deep packet inspection",
    category: "PACKET",
  },
  {
    id: "8",
    name: "Network Mapper",
    description: "Comprehensive network mapping",
    category: "NMAP",
  },
  {
    id: "9",
    name: "System Info",
    description: "Display system information",
    category: "INFO",
  },
];

export default function Terminal() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExecuting, setIsExecuting] = useState(false);
  
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Create session on mount
  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/terminal/session", {});
      return response.json();
    },
    onSuccess: (session) => {
      setSessionId(session.id);
      addInitialMessages();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create terminal session",
        variant: "destructive",
      });
    },
  });

  // Execute command mutation
  const executeCommandMutation = useMutation({
    mutationFn: async ({ sessionId, command }: { sessionId: string; command: string }) => {
      const response = await apiRequest("POST", "/api/terminal/execute", {
        sessionId,
        command,
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.command === "clear") {
        setTerminalLines([]);
        addInitialMessages();
      } else {
        const outputLines = result.output.split('\n');
        outputLines.forEach((line: string, index: number) => {
          setTimeout(() => {
            addTerminalLine(line, false);
          }, index * 150);
        });
      }
      setIsExecuting(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to execute command",
        variant: "destructive",
      });
      setIsExecuting(false);
    },
  });

  useEffect(() => {
    createSessionMutation.mutate();
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const addInitialMessages = () => {
    const initialLines: TerminalLine[] = [
      {
        id: "init-1",
        content: "╔══════════════════════════════════════════════════════════════╗",
        timestamp: new Date(),
      },
      {
        id: "init-2",
        content: "║                    CYBERSEC TERMINAL v2.4.1                 ║",
        timestamp: new Date(),
      },
      {
        id: "init-3",
        content: "║                   Educational Simulation                     ║",
        timestamp: new Date(),
      },
      {
        id: "init-4",
        content: "╚══════════════════════════════════════════════════════════════╝",
        timestamp: new Date(),
      },
      {
        id: "init-5",
        content: "[INFO] Terminal initialized successfully",
        timestamp: new Date(),
      },
      {
        id: "init-6",
        content: "[INFO] All simulation modules loaded",
        timestamp: new Date(),
      },
      {
        id: "init-7",
        content: "[INFO] Type a command number (1-9) or use the menu to get started",
        timestamp: new Date(),
      },
    ];
    setTerminalLines(initialLines);
  };

  const addTerminalLine = (content: string, isCommand = false) => {
    const newLine: TerminalLine = {
      id: `line-${Date.now()}-${Math.random()}`,
      content,
      timestamp: new Date(),
      isCommand,
    };
    setTerminalLines(prev => [...prev, newLine]);
  };

  const executeCommand = (command: string) => {
    if (!sessionId || isExecuting) return;

    setIsExecuting(true);
    addTerminalLine(`cybersec@simulator:~$ ${command}`, true);
    
    if (command.trim()) {
      setCommandHistory(prev => [command, ...prev.slice(0, 49)]);
    }
    
    executeCommandMutation.mutate({ sessionId, command });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(commandInput);
      setCommandInput("");
      setHistoryIndex(-1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-terminal text-foreground font-mono">
      {/* Educational Disclaimer */}
      <div className="bg-red-900 text-white text-center py-2 text-sm">
        ⚠️ EDUCATIONAL SIMULATION ONLY - NOT A REAL HACKING TOOL ⚠️
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-[calc(100vh-40px)]">
        {/* Sidebar Menu */}
        <div className="bg-secondary border-r border-primary/30 p-4 lg:h-full overflow-y-auto">
          <div className="mb-6">
            <h1 className="text-primary text-xl font-semibold terminal-glow mb-2">
              CyberSec Terminal
            </h1>
            <div className="text-accent text-sm">v2.4.1 - Educational Simulator</div>
            <div className="text-muted text-xs mt-1">
              Status: <span className="text-primary">ONLINE</span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-accent text-sm font-semibold mb-3 border-b border-accent/30 pb-1">
              AVAILABLE TOOLS
            </h2>

            {menuCommands.map((cmd) => (
              <button
                key={cmd.id}
                data-testid={`menu-command-${cmd.id}`}
                onClick={() => executeCommand(cmd.id)}
                className={`menu-item w-full text-left p-3 rounded border transition-all duration-200 group ${
                  cmd.isWarning
                    ? "border-red-500/20 bg-red-900/10"
                    : "border-primary/20"
                }`}
                disabled={isExecuting}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`group-hover:text-white ${
                      cmd.isWarning ? "text-red-400" : "text-primary"
                    }`}
                  >
                    {cmd.id}
                  </span>
                  <span
                    className={`text-xs ${
                      cmd.isWarning ? "text-red-300" : "text-accent"
                    }`}
                  >
                    {cmd.category}
                  </span>
                </div>
                <div className="text-sm mt-1">{cmd.name}</div>
                <div className="text-xs text-muted mt-1">{cmd.description}</div>
              </button>
            ))}

            <button
              data-testid="menu-command-clear"
              onClick={() => executeCommand("clear")}
              className="w-full text-left p-3 rounded border border-accent/20 transition-all duration-200 mt-4 hover:bg-accent/10"
              disabled={isExecuting}
            >
              <div className="text-accent text-sm">CLEAR</div>
              <div className="text-xs text-muted mt-1">Clear terminal output</div>
            </button>
          </div>
        </div>

        {/* Terminal Area */}
        <div className="bg-terminal flex flex-col h-full">
          {/* Terminal Header */}
          <div className="bg-secondary/50 border-b border-primary/30 p-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-primary"></div>
              </div>
              <span className="text-foreground text-sm">cybersec@simulator:~$</span>
            </div>
            <div className="text-xs text-muted">
              <span data-testid="terminal-time">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Terminal Output */}
          <div
            ref={terminalOutputRef}
            data-testid="terminal-output"
            className="flex-1 p-4 overflow-y-auto scroll-smooth"
          >
            <div className="space-y-1">
              {terminalLines.map((line) => (
                <div
                  key={line.id}
                  className={`terminal-line ${
                    line.isCommand ? "text-foreground" : ""
                  }`}
                >
                  <span className="text-muted text-xs mr-2">
                    [{line.timestamp.toLocaleTimeString()}]
                  </span>
                  <span
                    className={
                      line.content.includes("[ERROR]")
                        ? "text-red-400"
                        : line.content.includes("[WARNING]")
                        ? "text-yellow-400"
                        : line.content.includes("[INFO]")
                        ? "text-accent"
                        : line.content.includes("╔") || line.content.includes("║")
                        ? "text-primary terminal-glow"
                        : "text-foreground"
                    }
                  >
                    {line.content}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Command Input */}
          <div className="bg-secondary/30 border-t border-primary/30 p-4">
            <div className="flex items-center space-x-2">
              <span className="text-primary terminal-glow">cybersec@simulator:~$</span>
              <input
                ref={commandInputRef}
                data-testid="command-input"
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-foreground outline-none caret-primary"
                placeholder="Enter command..."
                disabled={isExecuting}
                autoFocus
              />
              {isExecuting && (
                <div className="typing border-r-2 border-primary animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
