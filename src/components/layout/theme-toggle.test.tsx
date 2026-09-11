import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";

const setThemeMock = vi.fn();
let currentTheme = "light";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: currentTheme,
    setTheme: setThemeMock,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentTheme = "light";
  });

  it("renders theme toggle button with accessible label", () => {
    render(<ThemeToggle label="สลับโหมด" />);
    const btn = screen.getByRole("button", { name: "สลับโหมด" });
    expect(btn).toBeDefined();
    expect(btn.className).toContain("icon-btn");
  });

  it("calls setTheme with 'dark' when current theme is 'light'", () => {
    render(<ThemeToggle label="สลับโหมด" />);
    const btn = screen.getByRole("button", { name: "สลับโหมด" });
    fireEvent.click(btn);
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'light' when current theme is 'dark'", () => {
    currentTheme = "dark";
    render(<ThemeToggle label="สลับโหมด" />);
    const btn = screen.getByRole("button", { name: "สลับโหมด" });
    fireEvent.click(btn);
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });
});
