import { useState, useEffect } from "react";
import ListTasks from "./ListTasks";

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
    <div className="container-fluid">
      <ListTasks />
    </div>
  );
};

export default Home;