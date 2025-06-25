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
  const [soon, setSoon] = useState('no');

  // New fields
  const [sessions, setSessions] = useState('');
  const [pair, setPair] = useState('');
  const [group, setGroup] = useState('');
  const [pre, setPre] = useState('');

  // Paired courses from /api/products
  const [pairCourses, setPairCourses] = useState([]);

  useEffect(() => {
    fetch('/api/category')
      .then(res => res.json())
      .then(setCategoryOptions);

    fetch('/api/sub')
      .then(res => res.json())
      .then(setAllSubCategories);

    fetch('/api/products')
      .then(res => res.json())
      .then(setPairCourses);
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
      soon,
      sessions: sessions.toString(),
      pair,
      group,
      pre,
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

      {/* Level */}
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

      {/* Duration */}
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

      {/* Age */}
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

      {/* Description */}
      <label className="block font-bold mb-1">Description</label>
      <ReactQuill
        value={description}
        onChange={setDescription}
        className="mb-4"
        theme="snow"
        placeholder="Write course description here..."
      />

      {/* Start Soon */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={soon === 'yes'}
          onChange={(e) => setSoon(e.target.checked ? 'yes' : 'no')}
          className="h-4 w-4"
        />
        <span className="text-sm font-medium">Start Soon</span>
      </label>

      {/* Sessions */}
      <input
        type="number"
        placeholder="Number of Sessions"
        value={sessions}
        onChange={(e) => setSessions(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      {/* Pair (from API) */}
      <label className="block font-bold mb-1">Paired Course</label>
      <select
        value={pair}
        onChange={(e) => setPair(e.target.value)}
        className="w-full border p-2 mb-4"
      >
        <option value="">Select a course</option>
        {pairCourses.map((course) => (
          <option key={course.id || course._id} value={course.title}>
            {course.title}
          </option>
        ))}
      </select>

      {/* Group */}
      <label className="block font-bold mb-1">Group Type</label>
      <div className="flex gap-4 mb-4">
        <label>
          <input
            type="radio"
            name="group"
            value="In Group"
            checked={group === 'In Group'}
            onChange={(e) => setGroup(e.target.value)}
            className="mr-1"
          />
          In Group
        </label>
        <label>
          <input
            type="radio"
            name="group"
            value="1 on 1"
            checked={group === '1 on 1'}
            onChange={(e) => setGroup(e.target.value)}
            className="mr-1"
          />
          1 on 1
        </label>
      </div>

      {/* Prerequisites */}
      <input
        type="text"
        placeholder="Prerequisites"
        value={pre}
        onChange={(e) => setPre(e.target.value)}
        className="w-full border p-2 mb-4"
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
