import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ConfigsPage from "./pages/ConfigsPage";
import { MemoryRouter } from "react-router-dom";
import { worker } from "./mocks/browser";
import { rest } from "msw";

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

jest.spyOn(window, "confirm").mockImplementation(() => true);

describe("ConfigsPage", () => {
  it("renders configs list", async () => {
    render(<MemoryRouter><ConfigsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Configs/)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: /\+ Add Config/i })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2)); // header + 1 row
  });

  it("shows empty message if backend returns no configs", async () => {
    worker.use(rest.get("/configs/", (req, res, ctx) => res(ctx.status(200), ctx.json([]))));
    render(<MemoryRouter><ConfigsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/No configurations found/i)).toBeInTheDocument());
  });

  it("deletes a config", async () => {
    render(<MemoryRouter><ConfigsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2));
    const deleteBtn = screen.getAllByRole("button", { name: /Delete/i })[0];
    fireEvent.click(deleteBtn);
    await waitFor(() => expect(screen.queryAllByRole("row")).toHaveLength(1));
  });

  it("shows error on API failure", async () => {
    worker.use(rest.get("/configs/", (req, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><ConfigsPage /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText(/Failed to fetch configs/i)).toBeInTheDocument());
  });
});
