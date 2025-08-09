import { Suspense, lazy } from "react";
import "./App.css";
import Header from "./Components/Header";
const Slider = lazy(() => import("./Components/Slider"));
const ProductionHouse = lazy(() => import("./Components/ProductionHouse"));
const GenreMovieList = lazy(() => import("./Components/GenreMovieList"));

function App() {
  return (
    <div>
      <Header />
      <Suspense
        fallback={<div className="text-white p-8">Loading content…</div>}
      >
        <Slider />
        <ProductionHouse />
        <GenreMovieList />
      </Suspense>
    </div>
  );
}

export default App;
