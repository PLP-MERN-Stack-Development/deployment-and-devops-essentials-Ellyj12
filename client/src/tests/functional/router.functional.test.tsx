import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { Protected } from "@/router";
import { useAuthStore } from "@/features/auth/store/authStore";

vi.mock("@/features/auth/store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("Protected route", () => {
  const useAuthStoreMock = useAuthStore as unknown as Mock;

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders child content when a user is present", () => {
    useAuthStoreMock.mockImplementation((selector?: (state: { user: unknown }) => unknown) =>
      selector ? selector({ user: { _id: "user-1" } }) : { user: { _id: "user-1" } }
    );

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Dashboard</div></Protected>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects to login when no user is found", () => {
    useAuthStoreMock.mockImplementation((selector?: (state: { user: unknown }) => unknown) =>
      selector ? selector({ user: null }) : { user: null }
    );

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Protected><div>Dashboard</div></Protected>} />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
