import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PortalAvatarMenu } from "./portal-avatar-menu";

vi.mock("next-auth/react", () => ({
  signOut: vi.fn(),
}));

describe("PortalAvatarMenu", () => {
  const defaultProps = {
    adminConsoleLabel: "แผงควบคุมเจ้าหน้าที่",
    profileLabel: "โปรไฟล์ของฉัน",
    signOutLabel: "ออกจากระบบ",
    signInLabel: "เข้าสู่ระบบ",
  };

  it("renders sign-in button when user is null (guest)", () => {
    render(<PortalAvatarMenu user={null} {...defaultProps} />);
    const link = screen.getByRole("link", { name: /เข้าสู่ระบบ/i });
    expect(link).toBeDefined();
    expect(link.getAttribute("href")).toBe("/dashboard");
  });

  it("renders avatar button with initials and user name when logged in", () => {
    render(
      <PortalAvatarMenu
        user={{ name: "Dr. Somchai", email: "somchai@mcu.ac.th", image: null }}
        {...defaultProps}
      />
    );
    const btn = screen.getByRole("button", { name: /Account menu for Dr. Somchai/i });
    expect(btn).toBeDefined();
    expect(screen.getByText("Dr. Somchai")).toBeDefined();
    expect(screen.getByText("D")).toBeDefined(); // Initials
  });
});
