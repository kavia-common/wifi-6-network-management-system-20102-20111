import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfigFormPage from "./pages/ConfigFormPage";
import { MemoryRouter } from "react-router-dom";
import { worker } from "./mocks/browser";
import { rest } from "msw";

// Mock useNavigate and useParams
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: undefined }),
    useNavigate: () => mockNavigate,
  };
});

beforeAll(() => worker.start());
afterEach(() => { worker.resetHandlers(); mockNavigate.mockClear(); });
afterAll(() => worker.stop());

describe("ConfigFormPage", () => {
  it("renders blank create form", () => {
    render(<MemoryRouter><ConfigFormPage mode="create" /></MemoryRouter>);
    expect(screen.getByLabelText(/SSID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Channel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/WPA3 Enabled/i)).toBeInTheDocument();
  });

  it("submits and navigates on add config", async () => {
    worker.use(
      rest.post("/configs/", (req, res, ctx) =>
        res(ctx.status(201), ctx.json({ id: 123, ...req.body }))
      )
    );
    render(<MemoryRouter><ConfigFormPage mode="create" /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Device ID/i), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText(/SSID/i), { target: { value: "TestSSID" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "secret" } });
    fireEvent.change(screen.getByLabelText(/Channel/i), { target: { value: "36" } });
    fireEvent.click(screen.getByLabelText(/WPA3 Enabled/i));
    fireEvent.click(screen.getByRole("button", { name: /Add Config/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/configs"));
  });

  it("shows error on save failure", async () => {
    worker.use(rest.post("/configs/", (req, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><ConfigFormPage mode="create" /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Device ID/i), { target: { value: "2" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Config/i }));
    await waitFor(() => expect(screen.getByText(/Failed to save config/i)).toBeInTheDocument());
  });
});
