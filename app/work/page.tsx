
"use client" 
import { useState, useEffect } from "react";
 

const page = () => {
  const [allTemp, setTemp] = useState<any>() 
  const [filterClientName, setFilterClientName] = useState(""); 

  // Filtered data based on user input
  const filteredData = allTemp?.filter((post) => {
    const matchesClient =
      filterClientName === "" ||
      post.data.fullName.toLowerCase().includes(filterClientName.toLowerCase());
 

    return matchesClient ;
  });

 
 

  // Fetch products and categories on load
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const response = await fetch('/api/work');
    if (response.ok) {
      const data = await response.json();
      setTemp(data);
    } else {
      console.error('Failed to fetch products');
    }
  };

 


  const handleDeleteOrder = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this?");
    if (!confirmDelete) return; // If user clicks Cancel, stop the function


    console.log("id", id);
    


    try {
      const response = await fetch(`/api/work/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("deleted");
        // Refresh orders after deletion
        window.location.replace("/work");;
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };



  return (
    <div className="container text-[12px]">
      <div className="flex justify-end items-center space-x-2 mb-4">
        <input
          type="text"
          value={filterClientName}
          onChange={(e) => setFilterClientName(e.target.value)}
          placeholder="Filter by Name"
          className="border p-1 text-xs"
        />
 
 
      </div>
      <table className="table table-striped ">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Name</th>
            <th scope="col"></th>
            <th scope="col"></th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.length > 0 ? (
            filteredData.map((post) => (
              <tr key={post.id}>

                <td> </td>
                <td>{post.data.fullName}</td>
                 <td> </td>
                  <td> </td>
                <td className="flex space-x-2">
                  <a
                    className="text-blue-700 bg-black p-1 w-14 h-8 flex items-center justify-center "
                    href={`/work1?id=${post.id}`}
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDeleteOrder(post.id)}
                    className="bg-red-500 text-white p-1 w-14 h-8 "
                  >
                    Delete
                  </button>
                  
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  )

}

export default page