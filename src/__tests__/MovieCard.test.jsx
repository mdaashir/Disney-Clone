import { describe, it, expect } from "vitest";
import { render, screen } from "./test-utils";
import MovieCard from "../Components/MovieCard";

describe("MovieCard", () => {
  it("renders movie card with poster path", () => {
    render(
      <MovieCard
        movie={{
          id: 1,
          title: "Test Movie",
          poster_path: "/test-poster.jpg",
          vote_average: 8.5,
        }}
      />,
    );

    // Check if the movie title is rendered (which should always be present)
    const movieTitle = screen.getByText("Test Movie");
    expect(movieTitle).toBeInTheDocument();

    // Check if the rating is displayed
    const rating = screen.getByText("8.5");
    expect(rating).toBeInTheDocument();
  });

  it("returns null when no poster_path", () => {
    const { container } = render(
      <MovieCard movie={{ id: 1, title: "No Poster Movie" }} />,
    );
    expect(container.firstChild).toBeNull();
  });
});
