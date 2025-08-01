import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "./components/Sidebar";
import { MemoryRouter } from "react-router-dom";

describe("Sidebar", () => {
  it("renders all main navigation links", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByText(/Dashboard/)).toBeInTheDocument();
    expect(screen.getByText(/Devices/)).toBeInTheDocument();
    expect(screen.getByText(/Configs/)).toBeInTheDocument();
  });

  it("renders emoji icons for nav links", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    expect(screen.getByLabelText("dashboard")).toBeInTheDocument();
    expect(screen.getByLabelText("devices")).toBeInTheDocument();
    expect(screen.getByLabelText("configs")).toBeInTheDocument();
  });
});
