'use client';

import { useState, useEffect } from 'react';

const ManageProject = () => {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    question: '',
    answer: '',
  });

  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/faq');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/faq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('FAQ added successfully!');
      setFormData({ question: '', answer: '' });
      window.location.href = '/faq';
    } else {
      const errorData = await res.json();
      setMessage(`Error: ${errorData.error}`);
    }
  };

  const handleEdit = (project) => {
    setEditMode(true);
    setEditFormData({ ...project });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/faq/${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setMessage('FAQ updated!');
        setEditMode(false);
        setEditFormData({ id: '', question: '', answer: '' });
        window.location.href = '/faq';
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const res = await fetch(`/api/faq/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('FAQ deleted!');
          window.location.href = '/faq';
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
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit FAQ' : 'Add FAQ'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Question</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={currentForm.question}
            onChange={(e) => updateField('question', e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Answer</label>
          <textarea
            className="border p-2 w-full"
            rows={4}
            value={currentForm.answer}
            onChange={(e) => updateField('answer', e.target.value)}
            required
          />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? 'Update FAQ' : 'Add FAQ'}
        </button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All FAQs</h2>
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr>
            <th className="border p-2">Question</th>
            <th className="border p-2">Answer</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((faq) => (
              <tr key={faq.id}>
                <td className="border p-2">{faq.question}</td>
                <td className="border p-2">{faq.answer}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No FAQs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProject;
