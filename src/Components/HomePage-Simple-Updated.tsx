export default function HomePage() {
  return (
    <main className="pt-20 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold p-8">
        Disney+ Home - Movies, TV Shows and Originals
      </h1>

      <div className="p-8">
        {/* Slider placeholder */}
        <div className="mb-8" data-testid="slider">
          <h2 className="text-xl mb-4">Trending Now</h2>
          <div className="bg-gray-800 h-64 rounded-lg flex items-center justify-center">
            <p>Slider content would go here</p>
          </div>
        </div>

        {/* Production houses placeholder */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Explore by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              "Disney",
              "Pixar",
              "Marvel",
              "Star Wars",
              "National Geographic",
            ].map((brand) => (
              <div
                key={brand}
                className="bg-gray-800 h-32 rounded-lg flex items-center justify-center"
              >
                <img
                  src={`/src/Assets/Images/${brand.toLowerCase().replace(" ", "")}.png`}
                  alt={`${brand} brand logo`}
                  className="max-h-16 max-w-24 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const sibling = target.nextSibling as HTMLElement;
                    if (sibling) sibling.style.display = "block";
                  }}
                />
                <span className="hidden text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-xl mb-4">Search Content</h2>
          <div className="bg-gray-800 rounded-lg p-4">
            <input
              type="text"
              placeholder="Search for movies, shows, and more..."
              className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400"
              data-testid="search-input"
            />
          </div>
        </div>

        {/* Movie sections placeholder */}
        <div>
          <h2 className="text-xl mb-4">Popular Movies</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-800 h-48 rounded-lg flex items-center justify-center"
              >
                <p>Movie {i}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
