'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import Upload from '../components/Upload';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function AddCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [duration, setDuration] = useState({ number: '', unit: 'days' });
  const [age, setAge] = useState({ from: '', to: '' });
  const [img, setImg] = useState(['']);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  useEffect(() => {
    fetch('/api/category')
      .then(res => res.json())
      .then(setCategoryOptions);

    fetch('/api/sub')
      .then(res => res.json())
      .then(setAllSubCategories);
  }, []);

  useEffect(() => {
    const filtered = allSubCategories.filter(
      (sub) => sub.category === selectedCategory
    );
    setFilteredSubCategories(filtered);
    setSelectedSubCategory('');
  }, [selectedCategory, allSubCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!img || img.length === 0 || !img[0]) {
      alert('Please upload at least one image');
      return;
    }

    const payload = {
      title,
      description,
      level,
      duration: JSON.stringify(duration),
      age: JSON.stringify(age),
      img,
      category: selectedCategory,
      subcategory: selectedSubCategory,
    };

    const res = await fetch('/api/course', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('Course added successfully!');
      window.location.href = '/dashboard';
    } else {
      alert('Failed to add course');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Add New Course</h1>

      <input
        type="text"
        placeholder="Course Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      />

      {/* Level Dropdown */}
      <label className="block font-bold mb-1">Course Level</label>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="">Select level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="high intermediate">High Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {/* Duration Input */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Duration"
          value={duration.number}
          onChange={(e) =>
            setDuration((prev) => ({ ...prev, number: e.target.value }))
          }
          className="w-full border p-2"
          required
        />
        <select
          value={duration.unit}
          onChange={(e) =>
            setDuration((prev) => ({ ...prev, unit: e.target.value }))
          }
          className="border p-2"
        >
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      {/* Age From / To Inputs */}
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Age From"
          value={age.from}
          onChange={(e) =>
            setAge((prev) => ({ ...prev, from: e.target.value }))
          }
          className="w-full border p-2"
          required
        />
        <input
          type="number"
          placeholder="Age To"
          value={age.to}
          onChange={(e) =>
            setAge((prev) => ({ ...prev, to: e.target.value }))
          }
          className="w-full border p-2"
          required
        />
      </div>

      {/* Category */}
      <label className="block font-bold mb-1">Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="w-full border p-2 mb-4"
        required
      >
        <option value="">Select a category</option>
        {categoryOptions.map((cat) => (
          <option key={cat.id} value={cat.name}>{cat.name}</option>
        ))}
      </select>

      {/* Subcategory */}
      {filteredSubCategories.length > 0 && (
        <>
          <label className="block font-bold mb-1">Subcategory</label>
          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="w-full border p-2 mb-4"
          >
            <option value="">Select a subcategory</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub.id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </>
      )}

      {/* Description Editor */}
      <label className="block font-bold mb-1">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write course description here..."
      />

      {/* Image Upload */}
      <label className="block font-bold mb-1">Course Image</label>
      <Upload onImagesUpload={(url) => setImg(url)} />

      <button type="submit" className="bg-green-600 text-white px-4 py-2 mt-6">
        Save Course
      </button>
    </form>
  );
}
