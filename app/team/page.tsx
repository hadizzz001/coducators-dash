'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Upload from '../components/Upload';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ManageTeam = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    category: 'admin',
    description: '',
    img: '',
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    position: '',
    category: 'admin',
    description: '',
    img: '',
  });

  const [message, setMessage] = useState('');
  const [team, setTeam] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await fetch('/api/team');
      if (res.ok) {
        const data = await res.json();
        setTeam(data);
      } else {
        console.error('Failed to fetch team');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Team member added successfully!');
      setFormData({
        name: '',
        position: '',
        category: 'admin',
        description: '',
        img: '',
      });
      window.location.href = '/team';
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  const handleEdit = (member) => {
    setEditMode(true);
    setEditFormData({ ...member });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/team/${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setMessage('Team member updated!');
        setEditMode(false);
        setEditFormData({
          id: '',
          name: '',
          position: '',
          category: 'admin',
          description: '',
          img: '',
        });
        window.location.href = '/team';
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const res = await fetch(`/api/team/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('Team member deleted!');
          window.location.href = '/team';
        } else {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const currentForm = editMode ? editFormData : formData;
  const updateField = (field, value) => {
    editMode
      ? setEditFormData({ ...editFormData, [field]: value })
      : setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit Team Member' : 'Add Team Member'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        {['name', 'position'].map((field) => (
          <div key={field}>
            <label className="block mb-1 capitalize">{field}</label>
            <input
              type="text"
              className="border p-2 w-full"
              value={currentForm[field]}
              onChange={(e) => updateField(field, e.target.value)}
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1">Category</label>
          <select
            className="border p-2 w-full"
            value={currentForm.category}
            onChange={(e) => updateField('category', e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <ReactQuill
            value={currentForm.description}
            onChange={(val) => updateField('description', val)}
          />
        </div>

        <div>
          <label className="block mb-1">Upload Image</label>
          <Upload onImagesUpload={(url) => updateField('img', url)} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? 'Update Member' : 'Add Member'}
        </button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}

      <h2 className="text-xl font-bold mt-8">Team Members</h2>
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {team.length > 0 ? (
            team.map((member) => (
              <tr key={member.id}>
                <td className="border p-2">{member.name}</td>
                <td className="border p-2">{member.position}</td>
                <td className="border p-2">{member.category}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(member)}
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No team members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageTeam;
