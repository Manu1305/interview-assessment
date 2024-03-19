import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { AuthContext } from "../components/AuthContext";
import { Navigate } from "react-router-dom";
import { Fade, Bounce } from "react-awesome-reveal";
function Home() {
  const [users, setUsers] = useState([]);
  const [value, onChange] = useState(new Date());
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const { token, loading, setToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user/allUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const saveAttendance = async () => {
    if (selectedUser) {
      try {
        await axios.put("http://localhost:8000/user/add-absents", {
          userId: selectedUser._id,
          date: value.toISOString(),
        });
        // Refetch users after adding absence
        const response = await axios.get("http://localhost:8000/user/allUsers");
        setUsers(response.data);
      } catch (error) {
        console.error("Error saving attendance:", error);
      }
    }
  };

  function logout() {
    setToken(null);
    localStorage.clear();
  }

  if (loading) {
    return null;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Bounce>
        <button className="text-red-900 font-bold" onClick={logout}>
          Logout
        </button>
      </Bounce>
      <div className="flex items-center justify-center">
        <table id="customers">
          <Fade>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Absent</th>
              </tr>
            </thead>
          </Fade>
          <Fade>
            <tbody>
              {users.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <span
                      className="cursor-pointer text-red-500"
                      onClick={() => {
                        setSelectedUser(item);
                        setShowCalendar(true);
                      }}
                    >
                      Click to add absents
                    </span>
                    <div className="bg-slate-400">
                      {item.absent.map((date) => (
                        <div key={date} className="border bg-slate-100">
                          {new Date(date).toLocaleDateString("en-US")}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Fade>
        </table>
        {showCalendar && (
          <div className="ml-10">
            <Calendar onChange={onChange} value={value} />
            <button
              onClick={() => {
                saveAttendance();
                setShowCalendar(false);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Attendance
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
