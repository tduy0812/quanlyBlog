import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlogAndLikes = async () => {
      try {
        const [blogResponse, likesResponse] = await Promise.all([
          axios.get(`http://localhost:3000/posts/${id}`),
          axios.get(`http://localhost:3000/posts/${id}/likes`)
        ]);
        
        setBlog(blogResponse.data);
        setLikes(likesResponse.data);
      } catch (error) {
        console.log('Error fetching blog or likes:', error);
        alert('Đã xảy ra lỗi trong quá trình lấy dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndLikes();
  }, [id]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!blog) {
    return <div className="text-center">Blog không tồn tại.</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body d-flex justify-content-between">
          <div className="me-3"> {/* Phần bên trái */}
            <h2 className="card-title">{blog.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
            <p className="card-text"><strong>Trạng thái:</strong> {blog.status}</p>
            <p className="card-text"><strong>Người Tạo:</strong> {blog.username}</p>
            <p className="mt-3"><strong>Số lượt thích:</strong> {likes.length}</p>
          </div>
          
          <div> {/* Phần bên phải */}
            {user?.username === blog.username && (
              <div className="mb-3">
                <Link to={`/blogs/edit/${id}`} className="btn btn-warning me-2">Chỉnh sửa</Link>
                <button onClick={async () => {
                  await axios.delete(`http://localhost:3000/posts/${id}`, { data: { username: user.username } });
                  navigate('/blogs');
                }} className="btn btn-danger">Xóa</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
