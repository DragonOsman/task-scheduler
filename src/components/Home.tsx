import { useState, useEffect } from "react";

const Home = () => {
  const [currentChild, setCurrentChild] = useState("Amira");

  const toggleCurrentChild = (child: string) => setCurrentChild(child);

  useEffect(() => {
    if (currentChild === "Amira") {
      toggleCurrentChild("Noora");
    } else if (currentChild === "Noora") {
      toggleCurrentChild("Amira");
    }
  }, [currentChild]);

  return (
    <header className="d-flex justify-content-center py-3">
      <h1 className="display-1">Welcome, {currentChild}! Please complete your tasks on time:</h1>
    </header>
  );
};

export default Home;