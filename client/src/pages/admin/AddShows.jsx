import React, { useEffect, useState } from "react";
import { dummyShowsData } from "../../assets/assets";
import Loading from "../../components/Loading";
import Title from "../../components/Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConvertor";

const AddShows = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");

  // fetch movies
  const fetchNowPlayingMovies = async () => {
    setNowPlayingMovies(dummyShowsData);
  };

  useEffect(() => {
    fetchNowPlayingMovies();
  }, []);

  // add show time
  const handleAddTime = () => {
    if (!dateTimeInput) return;

    const movieId = selectedMovie.id;

    setDateTimeSelection((prev) => ({
      ...prev,
      [movieId]: [
        ...(prev[movieId] || []),
        dateTimeInput,
      ],
    }));

    setDateTimeInput("");
  };

  const handleRemoveTime = (movieId, timeToRemove) => {
    setDateTimeSelection((prev) => {
      const updatedTimes = (prev[movieId] || []).filter(
        (t) => t !== timeToRemove
      );

      return {
        ...prev,
        [movieId]: updatedTimes,
      };
    });
  };

  // create show
  const handleCreateShow = () => {
    if (!selectedMovie) return;
    if (!showPrice) return alert("Enter price");
    if (!(dateTimeSelection[selectedMovie.id]?.length))
      return alert("Add at least one show time");

    const payload = {
      movieId: selectedMovie.id,
      showPrice: Number(showPrice),
      timings: dateTimeSelection[selectedMovie.id],
    };

    console.log("SEND TO BACKEND:", payload);

    // reset state
    setSelectedMovie(null);
    setDateTimeSelection({});
    setShowPrice("");
  };

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />

      {/* Movie List */}
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="group flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative max-w-40 cursor-pointer group-hover:not-hover:opacity-40 hover:-translate-y-1 transition duration-300"
              onClick={() => setSelectedMovie(movie)}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={movie.poster_path}
                  alt=""
                  className="w-full object-cover brightness-90"
                />

                <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average?.toFixed(1) || "0.0"}
                  </p>

                  <p className="text-gray-300">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {/* Selected mark */}
              {selectedMovie?.id === movie.id && (
                <div className="absolute top-2 right-2 flex items-center justify-center bg-primary h-6 w-6 rounded">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}

              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Creation Section */}
      {selectedMovie && (
        <div className="mt-10 max-w-xl">
          <p className="text-lg font-medium mb-3">
            Create Show for: {selectedMovie.title}
          </p>

          {/* DateTime Input */}
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="border p-2 rounded w-full mb-3 bg-transparent"
          />

          {/* Add Time */}
          <button
            onClick={handleAddTime}
            className="bg-primary px-4 py-2 rounded text-white mb-4"
          >
            Add Time
          </button>

          {/* Show selected times */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(dateTimeSelection[selectedMovie.id] || []).map((dt, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-primary/20 rounded text-sm"
              >
                {new Date(dt).toLocaleString()}
              </span>
            ))}
          </div>

          {/* Price Input */}
          <input
            type="number"
            placeholder={`Price (${currency})`}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="border p-2 rounded w-full mb-4 bg-transparent"
          />

          {/* Submit */}
          <button
            onClick={handleCreateShow}
            className="bg-primary text-white px-8 py-2 mt-6 rounded hover:bg-primary/90 transition-all cursor-pointer"
          >
            Add Show
          </button>
        </div>
      )}

      {/* Display Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2">Selected Date-Time</h2>

          <ul className="space-y-3">
            {Object.entries(dateTimeSelection).map(([movieId, times]) => (
              <li key={movieId}>
                <div className="font-medium">
                  {nowPlayingMovies.find(m => m.id == movieId)?.title || "Movie"}
                </div>

                <div className="flex flex-wrap gap-2 mt-1 text-sm">
                  {times.map((time) => (
                    <div
                      key={time}
                      className="border border-primary px-2 py-1 flex items-center rounded"
                    >
                      <span>{new Date(time).toLocaleString()}</span>

                      <DeleteIcon
                        onClick={() => handleRemoveTime(movieId, time)}
                        width={15}
                        className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

    </>
  ) : (
    <Loading />
  );
};

export default AddShows;