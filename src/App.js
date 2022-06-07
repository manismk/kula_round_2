import "./App.css";
import { useEffect, useState } from "react";
import { UserCard } from "./component/UserCard";

const getUrl = (location, technology, sort = "followers") => {
  return `https://api.github.com/search/users?q=type:user+language:${technology}+location:${location}
   &sort=${sort}&page=1`;
};

function App() {
  const [location, setLocation] = useState("");
  const [technology, setTechnology] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortFilter, setSortFilter] = useState("followers");

  useEffect(() => {
    if (location.length > 0 && technology.length > 0) {
      (async () => {
        setLoading(true);
        try {
          const data = await fetch(getUrl(location, technology, sortFilter));
          if (data.status === 200) {
            const result = await data.json();
            setUserData(result.items);
          } else throw new Error("Unhandled response", data);
        } catch (err) {
          setError("Something Went wrong. Try again...");
          console.log(err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [sortFilter]);

  const clickHandler = () => {
    if (location.length > 0 && technology.length > 0) {
      setLoading(true);
      fetch(getUrl(location, technology))
        .then((res) => res.json())
        .then((res) => {
          setUserData(res.items);
        })
        .catch((err) => {
          console.log(err);
          setError("Something Went wrong. Try again...");
        })
        .finally(() => setLoading(false));
    } else {
      setError("Please Enter something...");
    }
  };

  return (
    <div className="App">
      <h2>Github User search</h2>
      <input
        type="text"
        className="mr-rt-1"
        placeholder="Enter the location here"
        onChange={(e) => {
          setLocation(e.target.value);
          setError("");
        }}
        value={location}
      />
      <input
        type="text"
        placeholder="Enter the technology here"
        className="mr-rt-1"
        onChange={(e) => {
          setTechnology(e.target.value);
          setError("");
        }}
        value={technology}
      />

      <button onClick={clickHandler} className="mr-rt-1">
        Submit
      </button>
      {error.length > 0 && <p>{error}</p>}
      {userData.length > 0 && !loading && (
        <>
          <select
            name="sort"
            id="sort"
            onChange={(e) => setSortFilter(e.target.value)}
            className="mr-rt-1"
          >
            <option value="joined" selected={sortFilter === "joined"}>
              Joined
            </option>
            <option value="followers" selected={sortFilter === "followers"}>
              Most Followers
            </option>
            <option
              value="repositories"
              selected={sortFilter === "repositories"}
            >
              Most Repositories
            </option>
          </select>
          <div className="user--container">
            {userData.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default App;
