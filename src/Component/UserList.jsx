import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";

const UserList = () => {
  // state variables
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [genderFilter, setGenderFilter] = useState("gender");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [isSorted, setIsSorted] = useState(false);

   // Fetching data from the API
  useEffect(() => {
    setLoading(false);
    axios
      .get("https://dummyjson.com/users")
      .then((response) => {
        console.log("API Response:", response.data.users);
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setLoading(true);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Filtering users based on gender
  useEffect(() => {
    let filtered = users;
    if (genderFilter !== "gender") {
      filtered = filtered.filter((user) => user.gender === genderFilter);
    }
    setFilteredUsers(filtered);
  }, [genderFilter, users]);

  // Sorting functions
  const sortById = () => {
    if (isSorted) {
      setFilteredUsers(users);
    } else {
      const sorted = [...filteredUsers].sort((a, b) => b.id - a.id);
      setFilteredUsers(sorted);
    }
    setIsSorted(!isSorted);
  };

  const sortByName = () => {
    if (isSorted) {
      setFilteredUsers(users);
    } else {
      const sorted = [...filteredUsers].sort((a, b) =>
        a.firstName.localeCompare(b.firstName)
      );
      setFilteredUsers(sorted);
    }
    setIsSorted(!isSorted);
  };

   // Pagination calculations
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  return (
    <div className="userlist-main">
      <div className="container">
        <div className="txt">
          <h1>User List Page</h1>
        </div>

        <div className="filters-container">
          <div className="sort-btn">
            <div className="filter-gender">
              <label htmlFor="">
                Sort By Gender:
                <select
                  name="gender"
                  id="gender-select"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="gender">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        {loading ? (
          <>
            <div className="tables">
              <table border={1}>
                <thead>
                  <tr>
                    <th onClick={sortById}>ID <IoIosArrowRoundUp /><IoIosArrowRoundDown className="icon-color"/></th>
                    <th>Image</th>
                    <th onClick={sortByName}>Full Name <IoIosArrowRoundUp /><IoIosArrowRoundDown className="icon-color"/></th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Country</th>
                  </tr>
                </thead>
                {console.log(users[0].id.toString().length > 0)}
                <tbody>
                  {currentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        {user.id.toString().length <= 1 ? "0" : ""}
                        {user.id}
                      </td>
                      <td className="td-img">
                        <img src={user.image} alt="" />
                      </td>
                      <td>{`${user.firstName} ${user.lastName}`}</td>
                      <td>{user.age}</td>
                      <td>{user.gender}</td>
                      <td>{`${user.address.state}, ${
                        user.address.country === "United States" && "USA"
                      }`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              {Array.from(
                { length: Math.ceil(filteredUsers.length / itemsPerPage) },
                (_, index) => (
                  <button key={index} onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </button>
                )
              )}
            </div>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};

export default UserList;
