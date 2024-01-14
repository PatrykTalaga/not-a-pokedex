import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [text, setText] = useState("3");
  const [search, setSearch] = useState(true); //trigger for useEffect
  //handling api request status (loading, error, success):
  const [pokemonData, setPokemonData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    //you can't put await directly in use effect
    const apiGetData = async () => {
      setIsLoading(true);
      setPokemonData(null);
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${text.toLowerCase()}`
        );

        if (!response.ok)
          throw new Error(`HTTP ERROR, Status code: ${response.status}`);
        const data = await response.json();

        //processing data
        const abilitiesArr = data.abilities.map(
          (ability) => " " + ability.ability.name
        );
        setPokemonData({
          sprite: data.sprites.front_default,
          name: capitalize(data.name),
          type: capitalize(data.types[0].type.name),
          abilities: abilitiesArr.toString(),
          weight: data.weight,
        });
        setError(false);
      } catch (err) {
        setError(err.message);
        setPokemonData(null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    apiGetData();
  }, [search]);

  function capitalize(word) {
    let firstLetter = word.charAt(0);
    firstLetter = firstLetter.toUpperCase();
    const capitalizedWord = firstLetter + word.slice(1);
    return capitalizedWord;
  }

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2
      -translate-y-1/2 flex"
      >
        {/* left side */}
        <div
          className="w-64 pb-5 flex flex-col border-black border-4 rounded-lg
          items-center bg-red-600 bg-[url('assets/patternHex.svg')]
          bg-blend-darken"
        >
          {error && (
            <div
              className="flex flex-col gap-2 w-52 border-black border-2
             p-2 mt-4 rounded-lg pb-5 bg-[url('assets/paternDots.svg')]"
            >
              <p className="text-2xl font-bold text-zinc-800 text-center">
                No pokemon found
              </p>
            </div>
          )}

          {isLoading && (
            <div
              className="flex flex-col gap-2 w-52  border-black border-2
             p-2 mt-4 rounded-lg pb-5 bg-[url('assets/paternDots.svg')]"
            >
              <p className="text-2xl font-bold text-zinc-800 text-center">
                Loading...
              </p>
            </div>
          )}

          {pokemonData && (
            <div
              className="flex flex-col gap-1 w-52  border-black border-2
             p-2 mt-4 rounded-lg pb-5 bg-[url('assets/paternDots.svg')]"
            >
              <img src={pokemonData.sprite} className="h-44 object-cover"></img>
              <p className="text-2xl text-zinc-800">
                <span className="font-bold">Name:</span> {pokemonData.name}
              </p>
              <p className="text-2xl text-zinc-800">
                <span className="font-bold">Type:</span> {pokemonData.type}
              </p>
              <p className="text-2xl text-zinc-800">
                <span className="font-bold">Abilities:</span>{" "}
                {pokemonData.abilities}
              </p>
              <p className="text-2xl text-zinc-800">
                <span className="font-bold">Weight:</span> {pokemonData.weight}
              </p>
            </div>
          )}
        </div>

        <div
          className="flex flex-col bg-red-600 w-10 pb-5
        border-black border-2 rounded-lg items-center"
        ></div>

        {/* right side */}
        <div
          className="bg-[url('assets/patternHex.svg')] bg-blend-darken
          flex flex-col gap-10 pt-4 bg-red-600  w-72 pb-5 border-black
          border-4 rounded-lg items-center "
        >
          <div
            className="flex flex-col gap-1 items-center bg-slate-300
          rounded-lg border-black border-2 mx-3 py-3"
          >
            <p className="text-3xl text-zinc-800 font-bold  text-center">
              Not-a-PokeDex!
            </p>

            <input
              type="text"
              onChange={(e) => setText(e.target.value)}
              className="text-xl w-48 mt-3 mb-3 bg-zinc-200 border-black
              border-2 rounded-md"
            ></input>
            <button
              onClick={() => setSearch(!search)}
              className="border-zinc-800 rounded-md bg-blue-400 py-1 w-24
              text-xl border hover:scale-110"
            >
              Search
            </button>

            <p className="text-xl black text-center">
              Enter pokemon name or pokemon id
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
