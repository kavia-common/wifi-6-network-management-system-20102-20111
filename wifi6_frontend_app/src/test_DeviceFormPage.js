import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeviceFormPage from "./pages/DeviceFormPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { worker } from "./mocks/browser";
import { rest } from "msw";

// Mock useNavigate from react-router-dom
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

describe("DeviceFormPage", () => {
  it("renders empty form for create mode", () => {
    render(<MemoryRouter><DeviceFormPage mode="create" /></MemoryRouter>);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MAC Address/i)).toBeInTheDocument();
  });

  it("submits and navigates on add device", async () => {
    worker.use(
      rest.post("/devices/", (req, res, ctx) =>
        res(ctx.status(201), ctx.json({ id: 5, ...req.body }))
      )
    );
    render(<MemoryRouter><DeviceFormPage mode="create" /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "X" } });
    fireEvent.change(screen.getByLabelText(/MAC Address/i), { target: { value: "AA:BB:CC:01" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Device/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/devices"));
  });

  it("shows error on save failure", async () => {
    worker.use(rest.post("/devices/", (req, res, ctx) => res(ctx.status(500))));
    render(<MemoryRouter><DeviceFormPage mode="create" /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "err" } });
    fireEvent.change(screen.getByLabelText(/MAC Address/i), { target: { value: "AA:BB:CC:01" } });
    fireEvent.click(screen.getByRole("button", { name: /Add Device/i }));
    await waitFor(() => expect(screen.getByText(/Failed to save device/i)).toBeInTheDocument());
  });
});
