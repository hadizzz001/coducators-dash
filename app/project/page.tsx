'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Upload from '../components/Upload';
import Upload1 from '../components/Upload1';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const ManageProject = () => {
const [formData, setFormData] = useState({
  title: '',
  subtitle: '',
  student: '',
  age: '',
  description: '',
  img: '',
  video: '',
  course: '',
  game: '', // <-- added here
});

const [editFormData, setEditFormData] = useState({
  id: '',
  title: '',
  subtitle: '',
  student: '',
  age: '',
  description: '',
  img: '',
  video: '',
  course: '',
  game: '', // <-- added here
});


  const [message, setMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [courses, setCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/course');
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        } else {
          console.error('Failed to fetch courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);


  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/project');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      } else {
        console.error('Failed to fetch projects');
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
    const res = await fetch('/api/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('Project added successfully!');
      setFormData({
        title: '',
        subtitle: '',
        student: '',
        age: '',
        description: '',
        img: '',
        video: '',
        course: '',
        game: '',
      });
      window.location.href = '/project';
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
      const res = await fetch(`/api/project/${encodeURIComponent(editFormData.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setMessage('Project updated!');
        setEditMode(false);
        setEditFormData({
          id: '',
          title: '',
          subtitle: '',
          student: '',
          age: '',
          description: '',
          img: '',
          video: '',
          course: '',
          game: '',
        });
        window.location.href = '/project';
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        const res = await fetch(`/api/project/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMessage('Project deleted!');
          window.location.href = '/project';
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
      <h1 className="text-2xl font-bold mb-4">{editMode ? 'Edit Project' : 'Add Project'}</h1>
      <form onSubmit={editMode ? handleEditSubmit : handleSubmit} className="space-y-4">
        {['title', 'subtitle', 'student', 'age'].map((field) => (
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
  <label className="block mb-1">Game link</label>
  <input
    type="text"
    className="border p-2 w-full"
    value={currentForm.game}
    onChange={(e) => updateField('game', e.target.value)}
  />
</div>

        <div>
          <label className="block mb-1">Select Course</label>
          <select
            className="border p-2 w-full"
            value={currentForm.course}
            onChange={(e) => updateField('course', e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id || course._id} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </div>



        <div>
          <label className="block mb-1">Description</label>
          <ReactQuill value={currentForm.description} onChange={(val) => updateField('description', val)} />
        </div>

        <div>
          <label className="block mb-1">Upload Image</label>
          <Upload onImagesUpload={(url) => updateField('img', url)} />

        </div>

        <div>
          <label className="block mb-1">Upload Video</label>
          <Upload1 onFilesUpload={(url) => updateField('video', url)} />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editMode ? 'Update Project' : 'Add Project'}
        </button>
      </form>

      {message && <p className="mt-4 text-red-500">{message}</p>}

      <h2 className="text-xl font-bold mt-8">All Projects</h2>
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Student</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project.id}>
                <td className="border p-2">{project.title}</td>
                <td className="border p-2">{project.student}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(project)}
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
                No projects found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageProject;
