import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";
import * as auth from "./utils/auth";
import { worker } from "./mocks/browser";
import { rest } from "msw";

// Helper for routing
function renderApp(path = "/") {
  // JSDOM location hack for Router
  window.history.pushState({}, "Test page", path);
  return render(<App />);
}

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

// MOCK: Avoid real navigation and localStorage
jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(key => key === "wifi6_token" ? "test_jwt_token" : null);
jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => {});
jest.spyOn(window.localStorage.__proto__, "removeItem").mockImplementation(() => {});

describe("App Routing/Auth Flow", () => {
  it("redirects non-auth users to login", async () => {
    jest.spyOn(auth, "getToken").mockReturnValue(null);
    await act(async () => {
      renderApp("/dashboard");
    });
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it("shows sidebar on dashboard when logged in", async () => {
    jest.spyOn(auth, "getToken").mockReturnValue("test_jwt_token");
    await act(async () => {
      renderApp("/dashboard");
    });
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText("dashboard")).toBeInTheDocument();
  });

  it("hides sidebar on login and register pages", async () => {
    jest.spyOn(auth, "getToken").mockReturnValue(null);
    await act(async () => {
      renderApp("/login");
    });
    expect(screen.queryByLabelText("dashboard")).not.toBeInTheDocument();
    await act(async () => {
      renderApp("/register");
    });
    expect(screen.queryByLabelText("dashboard")).not.toBeInTheDocument();
  });

  it("theme toggle changes theme state", async () => {
    jest.spyOn(auth, "getToken").mockReturnValue("test_token");
    renderApp("/");
    const themeBtn = screen.getByRole("button", { name: /Switch to dark mode/i });
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    themeBtn.click();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
