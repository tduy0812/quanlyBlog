import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './BlogList.css';

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [likesData, setLikesData] = useState({});
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/posts');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likesPromises = blogs.map(blog => 
          axios.get(`http://localhost:3000/posts/${blog.id}/likes`)
        );
        const likesResponses = await Promise.all(likesPromises);
        const likesMap = {};
        likesResponses.forEach((response, index) => {
          likesMap[blogs[index].id] = response.data;
        });
        setLikesData(likesMap);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    if (blogs.length) {
      fetchLikes();
    }
  }, [blogs]);

  const handleLike = async (blogId) => {
    try {
      await axios.post(`http://localhost:3000/posts/${blogId}/like`, { username: user?.username });
      setLikesData(prev => ({
        ...prev,
        [blogId]: [...(prev[blogId] || []), { username: user.username }]
      }));
    } catch (err) {
      console.log('Error liking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình thích bài viết.');
    }
  };

  const handleUnlike = async (blogId) => {
    try {
      await axios.post(`http://localhost:3000/posts/${blogId}/unlike`, { username: user?.username });
      setLikesData(prev => ({
        ...prev,
        [blogId]: prev[blogId].filter(like => like.username !== user.username)
      }));
    } catch (err) {
      console.log('Error unliking post:', err.response?.data.message);
      alert('Đã xảy ra lỗi trong quá trình bỏ thích bài viết.');
    }
  };

  const filteredBlogs = blogs.filter(blog => blog.status === 'public' || blog.username === user.username);

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Bài Viết</h4>
        <Link to="/blogs/create" className="btn btn-light">
          Tạo Bài Viết
        </Link>
      </div>
      {filteredBlogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        filteredBlogs.map(blog => {
          const blogLikes = likesData[blog.id] || [];
          const hasLiked = blogLikes.some(like => like.username === user?.username);

          return (
            <div key={blog.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{blog.title}</h5>
                  {/* Nút Read more nằm ngang hàng với tiêu đề */}
                  <Link to={`/blogs/${blog.id}`} className="btn btn-light">Xem thêm</Link>
                </div>
                <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
                
                {/* Phần chứa nút thích và số lượt thích */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="d-flex align-items-center"> {/* Nút thích */}
                    {hasLiked ? (
                      <button onClick={() => handleUnlike(blog.id)} className="btn btn-secondary me-2">Bỏ thích</button>
                    ) : (
                      <button onClick={() => handleLike(blog.id)} className="btn btn-primary me-2">Thích</button>
                    )}
                    <span>{blogLikes.length}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default BlogList;
