'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';

const allowedId = '683de88b51941b68bd183f8c';

const ManageProject = () => {
  const [formData, setFormData] = useState({
    id: '',
    img: '',
    title: '',
    sub: '',
    desc: '',
    btn1: '',
    btn2: '',
  });

  const [message, setMessage] = useState('');

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/banner`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data[0]);
      } else {
        setMessage('Failed to load project data.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error fetching data.');
    }
  };

  useEffect(() => {
    fetchProject();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.id !== allowedId) {
      setMessage('This project is not editable.');
      return;
    }

    try {
      const res = await fetch(`/api/banner/${allowedId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Project updated successfully!');
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (err) {
      setMessage('Failed to update project.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Banner</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Image Upload</label>
          <Upload onImagesUpload={(url) => handleChange('img', url)} />
          {formData.img && (
            <img src={formData.img} alt="Banner" className="mt-2 max-h-48 object-cover rounded" />
          )}
        </div>

        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Subtitle</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.sub}
            onChange={(e) => handleChange('sub', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            className="border p-2 w-full h-32"
            value={formData.desc}
            onChange={(e) => handleChange('desc', e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label className="block mb-1">Button 1 Text</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.btn1}
            onChange={(e) => handleChange('btn1', e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Button 2 Text</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.btn2}
            onChange={(e) => handleChange('btn2', e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Banner
        </button>
      </form>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
};

export default ManageProject;
