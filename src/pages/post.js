// Post.js
import React, { useState } from 'react';
import styles from "../styles/Community.module.css";
import { collection, addDoc } from 'firebase/firestore';
import db from '../net/db';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from "@/net/firebaseApp";

const Post = () => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [roomID, setRoomID] = useState('');
  const router = useRouter();

  const auth = getAuth(app);
  const user = auth.currentUser;

  const submit = async () => {
    await addDoc(collection(db, 'articles'), {
      title,
      content,
      author: user.email,
      created_at: new Date().getTime(),
    });
    alert('저장 되었습니다');
    setTitle('');
    setContent('');
    setRoomID('');
    router.push('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleRoomIDChange = (e) => {
    setRoomID(e.target.value);
  };

  const wordCount = content.length;

  return (
    <>
      {showModal && (
        <div className={styles.modal}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={handleTitleChange}
            />
            <textarea
              className={styles.textarea}
              placeholder="내용"
              value={content}
              onChange={handleContentChange}
            ></textarea>
            <span className={styles.counter}>({wordCount}/200)</span>
            <br />
            <input
              type="text"
              placeholder="스터디룸 ID"
              value={roomID}
              onChange={handleRoomIDChange}
            />
            <div className={styles.buttonContainer}>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Post;
