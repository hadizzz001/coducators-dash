'use client';

import { useState, useEffect } from 'react'; 
import { redirect } from 'next/navigation';

const ManageCategory = () => {
  const [formData, setFormData] = useState({ name: ''  });
  const [editFormData, setEditFormData] = useState({ id: '', name: '' });
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]); 
  const [editMode, setEditMode] = useState(false);
 
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
 
   
  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
 
    

    if (res.ok) {
      setMessage('category added successfully!');
      setFormData({ name: '' });
      fetchCategories();
      window.location.href = '/category';
      
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };
 
  const handleEdit = (category) => {
    setEditMode(true);
    setEditFormData({
      id: category.id,
      name: category.name,  
    }); 
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/category?id=${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editFormData.name,  
        }),
      });

      if (res.ok) {
        window.location.reload(); 
        setEditFormData({ id: '', name: '' });
        setEditMode(false);
        fetchCategories();
        
      } else {
        window.location.reload();
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`); 
      }
    } catch (error) {
      window.location.reload();
      console.error('Error:', error);
      setMessage('An error occurred while updating the category.'); 
    }
  };
 
  const handleDelete = async (id) => {
    if (confirm(`Are you sure you want to delete this category?`)) {
      try {
        const res = await fetch(`/api/category?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('category deleted successfully!');
          fetchCategories();
          redirect('/category');
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

 

 

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit category' : 'Add category'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={editMode ? editFormData.name : formData.name}
            onChange={(e) =>
              editMode
                ? setEditFormData({ ...editFormData, name: e.target.value })
                : setFormData({ ...formData, name: e.target.value })
            }
            required
          />
        </div>  
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          {editMode ? 'Update Category' : 'Add category'}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All Categories</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full mt-4">
  <thead>
    <tr>
      <th className="border border-gray-300 p-2">Name</th> 
      <th className="border border-gray-300 p-2">Actions</th>
    </tr>
  </thead>
  <tbody>
    {categories.length > 0 ? (
      categories.map((category) => { 
        return (
          <tr key={category.id}>
            <td className="border border-gray-300 p-2">{category.name}</td>
             
            <td className="border border-gray-300 p-2 text-center">
              <button
                onClick={() => handleEdit(category)}
                className="bg-yellow-500 text-white px-4 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td colSpan={3} className="border border-gray-300 p-2 text-center">
          No categories found.
        </td>
      </tr>
    )}
  </tbody>
</table> 
      <style
          dangerouslySetInnerHTML={{
            __html:
              "\n  .uploadcare--widget {\n    background:black;\n  }\n  ",
          }}
        />
    </div>
  );
};

export default ManageCategory; 