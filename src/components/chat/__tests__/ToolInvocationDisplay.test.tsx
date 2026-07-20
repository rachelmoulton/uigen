import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

test("shows a friendly message when creating a file", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "1",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/components/Card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
});

test("shows a friendly message when editing a file via str_replace", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "2",
    toolName: "str_replace_editor",
    args: { command: "str_replace", path: "src/components/Card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("shows a friendly message when editing a file via insert", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "3",
    toolName: "str_replace_editor",
    args: { command: "insert", path: "src/components/Card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Editing Card.tsx")).toBeDefined();
});

test("shows a friendly message when viewing a file", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "4",
    toolName: "str_replace_editor",
    args: { command: "view", path: "src/components/Card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Viewing Card.tsx")).toBeDefined();
});

test("shows a friendly message when renaming a file", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "5",
    toolName: "file_manager",
    args: {
      command: "rename",
      path: "src/components/Card.tsx",
      new_path: "src/components/ProductCard.tsx",
    },
    state: "result",
    result: { success: true, message: "Renamed" },
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(
    screen.getByText("Renaming Card.tsx to ProductCard.tsx")
  ).toBeDefined();
});

test("shows a friendly message when deleting a file", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "6",
    toolName: "file_manager",
    args: { command: "delete", path: "src/components/Card.tsx" },
    state: "result",
    result: { success: true, message: "Deleted" },
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Deleting Card.tsx")).toBeDefined();
});

test("only shows the file name, not the full path", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "7",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/components/ui/Card.tsx" },
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(screen.queryByText("Creating src/components/ui/Card.tsx")).toBeNull();
});

test("shows a loading spinner while the tool call is in progress", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "8",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/components/Card.tsx" },
    state: "call",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  expect(screen.getByText("Creating Card.tsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).not.toBeNull();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows a completed indicator once the tool call has a result", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "9",
    toolName: "str_replace_editor",
    args: { command: "create", path: "src/components/Card.tsx" },
    state: "result",
    result: "Success",
  };

  const { container } = render(
    <ToolInvocationDisplay toolInvocation={toolInvocation} />
  );

  expect(container.querySelector(".bg-emerald-500")).not.toBeNull();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("falls back to the raw tool name for unknown tools", () => {
  const toolInvocation: ToolInvocation = {
    toolCallId: "10",
    toolName: "some_other_tool",
    args: {},
    state: "result",
    result: "Success",
  };

  render(<ToolInvocationDisplay toolInvocation={toolInvocation} />);

  expect(screen.getByText("some_other_tool")).toBeDefined();
});
