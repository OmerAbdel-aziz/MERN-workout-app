import { render, screen, fireEvent } from "@testing-library/react";
// import Login from "../components/Login"; // Adjust path accordingly
import { MemoryRouter } from "react-router-dom";

test("Login form submits user credentials", async () => {
  render(
    <MemoryRouter>
      {/* <Login /> */}
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText(/email/i);
  const passwordInput = screen.getByPlaceholderText(/password/i);
  const submitButton = screen.getByRole("button", { name: /login/i });

  fireEvent.change(emailInput, { target: { value: "test@example.com" } });
  fireEvent.change(passwordInput, { target: { value: "password123" } });
  fireEvent.click(submitButton);

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});
