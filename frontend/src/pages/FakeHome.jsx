import { useEffect, useState } from "react";
import api from "../api";

function FakeHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/accounts/profile/me/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const getField = (field) => {
    return field ? field : "Unavailable";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      {user ? (
        <>
          <h1>Welcome, {getField(user.username)}</h1>
          <p>
            <strong>Email:</strong> {getField(user.email)}
          </p>
          <p>
            <strong>First Name:</strong> {getField(user.first_name)}
          </p>
          <p>
            <strong>Last Name:</strong> {getField(user.last_name)}
          </p>
          <p>
            <strong>Birthday:</strong> {getField(user.birthday)}
          </p>
          <p>
            <strong>User ID:</strong> {getField(user.id)}
          </p>
        </>
      ) : (
        <h1>Loading user details...</h1>
      )}
    </div>
  );
}

export default FakeHome;
