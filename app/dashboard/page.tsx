'use client';

import { useState, useEffect } from 'react';
import Upload from '../components/Upload';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCourses = async () => {
    const res = await fetch('/api/course');
    const data = await res.json();
    setCourses(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/category');
    const data = await res.json();
    setCategories(data);
  };

  const fetchSubcategories = async () => {
    const res = await fetch('/api/sub');
    const data = await res.json();
    setSubcategories(data);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/course/${id}`, { method: 'DELETE' });
      fetchCourses();
    }
  };

  const handleEdit = (course) => setEditingCourse(course);

  const handleUpdate = async (updatedCourse) => {
    const res = await fetch(`/api/course/${updatedCourse.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCourse),
    });
    if (res.ok) {
      alert('Updated!');
      setEditingCourse(null);
      fetchCourses();
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || course.category === selectedCategory)
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      {editingCourse && (
        <EditCourseForm
          course={editingCourse}
          onCancel={() => setEditingCourse(null)}
          onSave={handleUpdate}
        />
      )}

      <h1 className="text-2xl font-bold mb-4">Course List</h1>

      <input
        className="w-full p-2 border mb-2"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title"
      />

      <select
        className="w-full p-2 border mb-4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">Filter by category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Level</th>
            <th className="border p-2">Duration</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Subcategory</th>
            <th className="border p-2">Starts Soon</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {filteredCourses.map((c) => (
    <tr key={c.id}>
      <td className="border p-2">{c.title}</td>
      <td className="border p-2">{c.level}</td>
      <td className="border p-2">
        {JSON.parse(c.duration).number} {JSON.parse(c.duration).unit}
      </td>
      <td className="border p-2">
        {JSON.parse(c.age).from}–{JSON.parse(c.age).to}
      </td>
      <td className="border p-2">
        <img src={c.img[0]} className="w-24" />
      </td>
      <td className="border p-2">{c.category}</td>
      <td className="border p-2">{c.subcategory}</td>
      <td className="border p-2">{c.soon}</td>
      <td className="border p-2">
        <button
          onClick={() => handleEdit(c)}
          className="px-2 py-1 bg-yellow-500 text-white mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(c.id)}
          className="px-2 py-1 bg-red-500 text-white"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
}


function EditCourseForm({ course, onCancel, onSave }) {
  const [title, setTitle] = useState(course.title || '');
  const [level, setLevel] = useState(formatLevel(course.level));
  const [duration, setDuration] = useState(parseJSON(course.duration));
  const [age, setAge] = useState(parseJSON(course.age));
  const [category, setCategory] = useState(course.category || '');
  const [subcategory, setSubcategory] = useState(course.subcategory || '');
  const [description, setDescription] = useState(course.description || '');
  const [img, setImg] = useState(course.img || []);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [soon, setSoon] = useState(course.soon);


  useEffect(() => {
    const fetchAll = async () => {
      const [cat, sub] = await Promise.all([
        fetch('/api/category').then(res => res.json()),
        fetch('/api/sub').then(res => res.json())
      ]);
      setCategories(cat);
      setSubcategories(sub);
    };
    fetchAll();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
const payload = {
  ...course,
  title,
  level,
  duration: JSON.stringify(duration),
  age: JSON.stringify(age),
  category,
  subcategory,
  description,
  img,
  soon,
};

    onSave(payload);
  };

  const filteredSub = subcategories.filter(s => s.category === category);

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 mb-6 rounded">
      <h2 className="text-xl font-bold mb-4">Edit Course</h2>

      <input
        className="w-full p-2 border mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />

      <select
        className="w-full p-2 border mb-2"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        required
      >
        <option value="">Select Level</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="High Intermediate">High Intermediate</option>
        <option value="Advance">Advance</option>
      </select>

      <div className="flex gap-2 mb-2">
        <input
          className="w-1/2 p-2 border"
          type="number"
          value={duration.number || ''}
          onChange={(e) => setDuration(prev => ({ ...prev, number: e.target.value }))}
          placeholder="Duration Number"
          required
        />
        <select
          className="w-1/2 p-2 border"
          value={duration.unit || ''}
          onChange={(e) => setDuration(prev => ({ ...prev, unit: e.target.value }))}
          required
        >
          <option value="">Select Unit</option>
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      <div className="flex gap-2 mb-2">
        <input
          className="w-1/2 p-2 border"
          type="number"
          value={age.from || ''}
          onChange={(e) => setAge(prev => ({ ...prev, from: e.target.value }))}
          placeholder="Age From"
          required
        />
        <input
          className="w-1/2 p-2 border"
          type="number"
          value={age.to || ''}
          onChange={(e) => setAge(prev => ({ ...prev, to: e.target.value }))}
          placeholder="Age To"
          required
        />
      </div>

      <select
        className="w-full p-2 border mb-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {category && filteredSub.length > 0 && (
        <select
          className="w-full p-2 border mb-2"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          required
        >
          <option value="">Select Subcategory</option>
          {filteredSub.map((sub) => (
            <option key={sub.id} value={sub.name}>
              {sub.name}
            </option>
          ))}
        </select>
      )}

      <ReactQuill value={description} onChange={setDescription} className="mb-4" theme="snow" />

<label className="flex items-center gap-2 mb-4">
  <input
    type="checkbox"
    checked={soon === 'yes'}
    onChange={(e) => setSoon(e.target.checked ? 'yes' : 'no')}
    className="h-4 w-4"
  />
  <span className="text-sm font-medium">Start Soon</span>
</label>


      <Upload onImagesUpload={(urls) => setImg(urls)} />

      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-600 text-white px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}

// Helper functions
function parseJSON(jsonString) {
  try {
    const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
    return parsed || {};
  } catch (e) {
    return {};
  }
}

function formatLevel(lvl) {
  const map = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    'high intermediate': 'High Intermediate',
    advance: 'Advance',
  };
  return map[lvl?.toLowerCase()] || '';
}

