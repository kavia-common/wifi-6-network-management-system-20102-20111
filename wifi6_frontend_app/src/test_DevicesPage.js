import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DevicesPage from "./pages/DevicesPage";
import { MemoryRouter } from "react-router-dom";
import { worker } from "./mocks/browser";
import { rest } from "msw";

// Mock window.confirm (since delete requires confirmation)
beforeAll(() => {
  jest.spyOn(window, "confirm").mockImplementation(() => true);
  worker.start();
});
afterEach(() => worker.resetHandlers());
afterAll(() => {
  window.confirm.mockRestore();
  worker.stop();
});

describe("DevicesPage", () => {
  it("renders device table with mock device", async () => {
    render(
      <MemoryRouter>
        <DevicesPage />
      </MemoryRouter>
    );
    await waitFor(() =>
      expect(screen.getByText("Router1")).toBeInTheDocument()
    );
    expect(screen.getByText("AA:BB:CC:DD:EE:01")).toBeInTheDocument();
    expect(screen.getByText("online")).toBeInTheDocument();
  });

  it("shows no devices message when backend returns empty", async () => {
    worker.use(rest.get("/devices/", (req, res, ctx) => res(ctx.status(200), ctx.json([]))));
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/No devices yet/i)).toBeInTheDocument());
  });

  it("deletes device and updates table", async () => {
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText("Router1")).toBeInTheDocument());
    const deleteBtn = screen.getByRole("button", { name: /Delete/i });
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(screen.queryByText("Router1")).not.toBeInTheDocument());
  });

  it("shows error on API failure", async () => {
    worker.use(rest.get("/devices/", (req, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><DevicesPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Failed to fetch devices/i)).toBeInTheDocument());
  });
});
