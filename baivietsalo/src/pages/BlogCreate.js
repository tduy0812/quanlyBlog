import React, { useState } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function BlogCreate() {
  const [formData, setFormData] = useState({ title: '', content: '', status: 'public' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      await axios.post('http://localhost:3000/posts', { ...formData, username: user.username });
      setFormData({ title: '', content: '', status: 'public' });
      alert('Blog created successfully!');
    } catch (err) {
      setError('Error creating blog: ' + err.response?.data.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Tạo Bài Viết</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Tiêu đề</label>
          <input
            type="text"
            id="title"
            className="form-control"
            placeholder="Nhập tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">Nội dung</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.content}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData({ ...formData, content: data });
            }}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Trạng thái</label>
          <select
            id="status"
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="public">Công khai</option>
            <option value="private">Riêng tư</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Tạo</button>
      </form>
    </div>
  );
}

export default BlogCreate;
