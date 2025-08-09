import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../Components/Header";

describe("Header", () => {
  it("renders logo image", () => {
    render(<Header />);
    const logo = screen.getAllByRole("img")[0];
    expect(logo).toBeInTheDocument();
  });

  it("toggles mobile menu", () => {
    render(<Header />);
    const buttons = screen.getAllByRole("button");
    const moreBtn = buttons.find(
      (b) => b.getAttribute("aria-label") === "More navigation",
    );
    expect(moreBtn).toBeDefined();
    fireEvent.click(moreBtn);
    expect(
      screen.getByRole("navigation", { name: /mobile navigation/i }),
    ).toBeInTheDocument();
  });
});
