import { Input, Layout, Select, Space, theme } from "antd";
import { useEffect, useRef, useState } from "react";
import { HttpRequest } from "../api/util.js";
import { useNavigate } from "react-router-dom";
import type { InputRef } from "antd/es/input";

// 定义命令类型
type CommandType = "cmd" | "sql";

interface CommandContext {
  clearHistory: () => void;
  type: CommandType;
  setType: (type: CommandType) => void;
}

// 定义命令接口
interface Command {
  execute: (
    args: string[],
    context: CommandContext
  ) => Promise<string | null> | string | null;
  description: string;
  usage: string;
}

// 定义命令解析器
class CommandParser {
  static parse(input: string): { command: string; args: string[] } {
    const parts = input.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    return { command, args };
  }
}

export default function Developer() {
  const navigate = useNavigate();
  const text = useRef<any>(null);
  const { token } = theme.useToken();
  const inputRef = useRef<InputRef>(null);
  const [message, setMessage] = useState("");
  const [input, setInput] = useState("");
  const [textLine, setTextLine] = useState<string[]>([]);
  const [type, setType] = useState<CommandType>("cmd");
  const [isProcessing, setIsProcessing] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const selector = [
    { value: "cmd", label: "command" },
    { value: "sql", label: "sql" },
  ];

  // 定义命令系统
  const COMMANDS: Record<string, Command> = {
    help: {
      execute: () => {
        return Object.entries(COMMANDS)
          .map(([name, cmd]) => `${name.padEnd(10)} - ${cmd.description}`)
          .join("\n");
      },
      description: "显示所有可用命令",
      usage: "help",
    },
    exit: {
      execute: () => {
        navigate("/");
        return "正在退出...";
      },
      description: "退出开发者控制台",
      usage: "exit",
    },
    quit: {
      execute: (args, context) => COMMANDS.exit.execute(args, context),
      description: "退出开发者控制台",
      usage: "quit",
    },
    oauth: {
      execute: async () => {
        try {
          const rep = await HttpRequest.get("/api/public/getOauthUrl");
          return `OAuth URL: ${rep.data.code}`;
        } catch (error: any) {
          return `Error: ${error.message}`;
        }
      },
      description: "获取 OAuth URL",
      usage: "oauth",
    },
    clear: {
      execute: (_, { clearHistory }) => {
        clearHistory();
        return null; // 返回 null 表示不需要显示任何消息
      },
      description: "清空控制台",
      usage: "clear",
    },
    echo: {
      execute: (args: string[]) => args.join(" "),
      description: "显示消息",
      usage: "echo [message]",
    },
    mode: {
      execute: ([newMode], { type, setType }) => {
        if (newMode && (newMode === "cmd" || newMode === "sql")) {
          setType(newMode);
          return `已切换到 ${newMode} 模式`;
        }
        return `当前模式：${type}`;
      },
      description: "查看或切换命令模式",
      usage: "mode [cmd|sql]",
    },
    history: {
      execute: () => {
        // 获取当前历史记录
        return (
          "最近的命令历史：\n" +
          textLine
            .filter((line) => line.startsWith(">"))
            .slice(0, 10)
            .map((line) => line.substring(2))
            .join("\n")
        );
      },
      description: "显示命令历史",
      usage: "history",
    },
  };

  const clearHistory = () => {
    setTextLine([]);
    setMessage("");
  };

  const sysMsg = (s: string) => {
    setTextLine((old) => [s, ...old]);
    text.current.resizableTextArea.textArea.scrollTop = 0;
  };

  const userMsg = (s: string) => {
    s = `> ${s}`;
    sysMsg(s);
  };

  const executeCommand = async (input: string) => {
    if (!input.trim()) return;

    userMsg(input);
    setIsProcessing(true);

    try {
      if (type === "sql") {
        sysMsg(`执行 SQL: ${input}`);
        // SQL 执行逻辑
        // ...
      } else {
        // 普通命令处理
        const { command, args } = CommandParser.parse(input);

        if (command in COMMANDS) {
          const context = {
            clearHistory,
            type,
            setType,
          };
          const result = await COMMANDS[command].execute(args, context);
          if (result !== null) {
            sysMsg(result);
          }
        } else {
          sysMsg(`未知命令: ${command}\n输入 'help' 查看可用命令`);
        }
      }
    } catch (error: any) {
      sysMsg(`错误: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  async function onEnter(value: string) {
    if (!value || isProcessing) return;

    setInput("");
    await executeCommand(value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "Enter":
        if (!e.repeat && input.trim()) {
          e.preventDefault();
          setCommandHistory((prev) => [input, ...prev].slice(0, 50)); // 保留最近50条命令
          setHistoryIndex(-1);
          onEnter(input);
          // 命令执行后重新获取焦点
          setTimeout(() => inputRef.current?.focus(), 0);
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex =
            historyIndex < commandHistory.length - 1
              ? historyIndex + 1
              : historyIndex;
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex] || "");
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (historyIndex > -1) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(newIndex === -1 ? "" : commandHistory[newIndex] || "");
        }
        break;
    }
  };

  useEffect(() => {
    // 处理命令
    setMessage(textLine.join("\n"));
  }, [textLine]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // 初始化欢迎消息
    sysMsg("欢迎使用开发者控制台 (输入 'help' 查看可用命令)");
  }, []);

  return (
    <Layout style={{ minHeight: "100%" }}>
      <Layout.Header style={{ backgroundColor: token.colorPrimaryBg }}>
        <Space.Compact style={{ width: "100%" }}>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? "处理中..." : "输入命令..."}
            disabled={isProcessing}
          />
          <Select
            value={type}
            onChange={setType}
            style={{ width: "120px" }}
            options={selector}
            disabled={isProcessing}
          />
        </Space.Compact>
      </Layout.Header>
      <Layout.Content>
        <div style={{ padding: "50px 50px 0", width: "100%", height: "80vh" }}>
          <Input.TextArea
            ref={text}
            variant="borderless"
            value={message}
            style={{
              resize: "none",
              backgroundColor: token.colorBgContainer,
              color: token.colorText,
              fontFamily: "monospace",
            }}
            readOnly
          />
        </div>
      </Layout.Content>
    </Layout>
  );
}
