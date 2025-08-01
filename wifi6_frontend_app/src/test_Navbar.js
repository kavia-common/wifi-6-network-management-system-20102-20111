import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./components/Navbar";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import * as auth from "./utils/auth";

// Utility to simulate login state
function mockToken(token = "mock-token") {
  jest.spyOn(auth, "getToken").mockReturnValue(token);
}
function clearMocks() {
  jest.resetAllMocks();
  localStorage.clear();
}

describe("Navbar", () => {
  beforeEach(() => clearMocks());
  afterEach(() => clearMocks());

  it("renders app title", () => {
    render(
      <MemoryRouter>
        <Navbar theme="light" toggleTheme={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/WiFi 6 Config Manager/i)).toBeInTheDocument();
  });

  it("shows login/register links when logged out", () => {
    jest.spyOn(auth, "getToken").mockReturnValue(null);
    render(
      <MemoryRouter>
        <Navbar theme="light" toggleTheme={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Register/i)).toBeInTheDocument();
  });

  it("shows navbar links and logout button when logged in", () => {
    mockToken();
    render(
      <MemoryRouter>
        <Navbar theme="light" toggleTheme={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
    expect(screen.getByText(/Devices/)).toBeInTheDocument();
    expect(screen.getByText(/Configs/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Logout/i })).toBeInTheDocument();
  });

  it("calls toggleTheme when theme button is clicked", () => {
    const toggle = jest.fn();
    render(
      <MemoryRouter>
        <Navbar theme="light" toggleTheme={toggle} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Switch to dark mode/i }));
    expect(toggle).toHaveBeenCalled();
  });

  it("navigates to login on logout", () => {
    mockToken();
    const navigateMock = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(navigateMock);
    render(
      <MemoryRouter>
        <Navbar theme="dark" toggleTheme={() => {}} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: /Logout/i }));
    expect(navigateMock).toHaveBeenCalledWith("/login");
    // Token must be cleared
    expect(localStorage.getItem("wifi6_token")).toBeFalsy();
  });
});
