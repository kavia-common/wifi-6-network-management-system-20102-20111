import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./pages/LoginPage";
import { MemoryRouter } from "react-router-dom";
import * as auth from "./utils/auth";
import { worker } from "./mocks/browser";
import { rest } from "msw";

beforeAll(() => worker.start());
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());

jest.mock("./utils/auth");

describe("LoginPage", () => {
  it("renders login form with username and password", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("shows error on invalid login", async () => {
    // Let MSW default handler for login fail (default: wrong password)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "nope" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "badpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });

  it("sets token and navigates on valid login", async () => {
    // Patch MSW handler to allow login
    worker.use(
      rest.post("/users/login", (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ access_token: "mockedtoken", token_type: "bearer" }));
      })
    );
    const setTokenMock = jest.spyOn(auth, "setToken").mockImplementation(() => {});
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: "adminpass" } });
    fireEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(setTokenMock).toHaveBeenCalledWith("mockedtoken");
    });
  });
});
