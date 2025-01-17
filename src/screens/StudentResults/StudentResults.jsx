import CustomHeader from "../../components/CustomHeader/CustomHeader.jsx";
import {useEffect, useState} from "react";
import api from "../../helpers/AxiosInstance.js";

function StudentResults () {

  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await api.get("api/v1/answers");
      console.log(response)
      if (response.data.data.length > 0) {
        setList(response.data.data);
      } else {
        setError("No Results found");
      }
    } catch (err) {
      console.error("Error fetching Results:", err);
      setError("Failed to fetch Results. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleRemove = async (id) => {
    try {
      await api.delete(`/api/v1/results/${id}`);
      await fetchResults();
      setError("");
    } catch (err) {
      console.error("Error removing results:", err);
      setError("Failed to remove the results. Please try again.");
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const data = {
        dtStudioName: updatedData.dtStudioName,
        dtStudioCapacity: updatedData.dtCapacity
      }
      await api.patch(`/api/v1/results/${id}`, data);
      await fetchResults()
      setError("");
    } catch (err) {
      console.error("Error editing results:", err);
      setError("Failed to edit the results. Please try again.");
    }
  };

  return (
      <div className="manageStudiosContainer p-6">
        <CustomHeader/>
        {loading ? (
            <p>Loading Results...</p>
        ) : error ? (
            <p className="text-red-500 mb-9">{error}</p>
        ) : (

          <div className={"listTableContainer w-100 px-5"}>
            <table className="listTable table rounded-lg overflow-hidden">
              <thead className={"listHeader"}>
              <tr className={"listItem"}>
                <th scope="col">Selected Studio</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
              </thead>
              <tbody>
              {list.map((studio) => (
                  <tr key={studio.idStudio}>
                    <th scope="row">{studio.dtStudioName}</th>
                    <td>{studio.dtStudioCapacity}</td>
                    <td>{studio.dtStatus}</td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        )
      }
  </div>
)
}

export default StudentResults
