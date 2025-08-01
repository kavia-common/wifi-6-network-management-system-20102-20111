import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "./pages/RegisterPage";
import { MemoryRouter } from "react-router-dom";
import { worker } from "./mocks/browser";
import { rest } from "msw";

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

describe("RegisterPage", () => {
  it("renders registration form", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  });

  it("displays error if backend refuses registration", async () => {
    worker.use(
      rest.post("/users/register", (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ detail: "fail" }));
      })
    );
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => expect(screen.getByText(/Registration failed/i)).toBeInTheDocument());
  });

  it("navigates to login page on successful registration", async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require("react-router-dom"), "useNavigate").mockReturnValue(mockNavigate);
    worker.use(
      rest.post("/users/register", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ username: "newuser", full_name: "hi" }));
      })
    );
    render(<MemoryRouter><RegisterPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: "pw" } });
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });
});
