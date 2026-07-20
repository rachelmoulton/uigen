"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationDisplayProps {
  toolInvocation: ToolInvocation;
}

function fileName(path: string): string {
  return path.split("/").pop() || path;
}

function getToolMessage({ toolName, args }: ToolInvocation): string {
  if (toolName === "str_replace_editor") {
    const path = args?.path ? fileName(args.path) : "file";
    switch (args?.command) {
      case "create":
        return `Creating ${path}`;
      case "str_replace":
      case "insert":
        return `Editing ${path}`;
      case "view":
        return `Viewing ${path}`;
      case "undo_edit":
        return `Undoing last edit to ${path}`;
      default:
        return `Updating ${path}`;
    }
  }

  if (toolName === "file_manager") {
    const path = args?.path ? fileName(args.path) : "file";
    if (args?.command === "rename") {
      const newPath = args?.new_path ? fileName(args.new_path) : "new file";
      return `Renaming ${path} to ${newPath}`;
    }
    if (args?.command === "delete") {
      return `Deleting ${path}`;
    }
    return `Updating ${path}`;
  }

  return toolName;
}

export function ToolInvocationDisplay({
  toolInvocation,
}: ToolInvocationDisplayProps) {
  const isComplete =
    toolInvocation.state === "result" && Boolean(toolInvocation.result);
  const message = getToolMessage(toolInvocation);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isComplete ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-700">{message}</span>
    </div>
  );
}
