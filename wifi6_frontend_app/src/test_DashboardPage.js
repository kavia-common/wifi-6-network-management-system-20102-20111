import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./pages/DashboardPage";

describe("DashboardPage", () => {
  it("renders the dashboard welcome page", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to WiFi 6 Configuration Manager/i)
    ).toBeInTheDocument();
  });
});
