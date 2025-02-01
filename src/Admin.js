import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [admissions, setAdmissions] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const admissionsResponse = await axios.get("http://localhost:8001/admissions");
        const visitorsResponse = await axios.get("http://localhost:8001/visitors");

        setAdmissions(admissionsResponse.data);
        setVisitors(visitorsResponse.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Interested Admission Students</h1>
      <table border="1" style={{ width: "100%", marginBottom: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission, index) => (
            <tr key={index}>
              <td>{admission.name}</td>
              <td>{admission.phone}</td>
              <td>{admission.address}</td>
              <td>{admission.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Visitors</h1>
      <table border="1" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((visitor, index) => (
            <tr key={index}>
              <td>{visitor.email}</td>
              <td>{new Date(visitor.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
