import React, { useState, useEffect } from 'react';
import logo from '../../public/logo.png';
import styles from '../styles/Community.module.css';
import navStyles from '../styles/nav.module.css';
import Image from 'next/image';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, setDoc } from 'firebase/firestore';
import db from '../net/db';
import Post from './post';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

function Community() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [roomID, setRoomID] = useState('');
  const [roomIdError, setRoomIdError] = useState(false);
  const [missingFieldsError, setMissingFieldsError] = useState(false);
  const [posts, setPosts] = useState([]); // 배열로 포스트들을 관리
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'articles', router.query.id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setTitle(data.title);
        setContent(data.content);
      } catch (error) {
        // 에러 처리
      }
    };

    fetchData();
  }, [router.query.id]);

  const openModal = () => {
    setShowModal(true);
  };

  const firestore = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim() === '' || content.trim() === '' || roomID.trim() === '') {
      setMissingFieldsError(true);
      return;
    }

    const firestore = getFirestore();

    // 해당 roomID가 이미 Firestore에 존재하는지 확인
    const roomRef = doc(firestore, 'posts', roomID);
    const roomDoc = await getDoc(roomRef);

    if (roomDoc.exists()) {
      // 이미 존재하는 roomID인 경우 오류 처리
      setRoomIdError(true);
      return;
    }

    await setDoc(roomRef, {
      title,
      content,
      roomID,
    });

    console.log('title : ' + title + ' content : ' + content + ' roomID : ' + roomID);
    setTitle('');
    setContent('');
    setRoomID('');
    setRoomIdError(false);
    setMissingFieldsError(false);
    setShowModal(false);

    // 새로운 포스트를 배열에 추가
    const newPost = {
      title,
      content,
      roomID,
    };
    setPosts([newPost, ...posts]);
  };

  const handleTitleChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 50) {
      setTitle(inputValue);
    }
  };

  const handleContentChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 200) {
      setContent(inputValue);
    }
  };

  const wordCount = content.length;

  const handleRoomIDChange = (e) => {
    const inputValue = e.target.value;
    const englishRegex = /^[a-zA-Z0-9]*$/;
    if (englishRegex.test(inputValue) && inputValue.length <= 20) {
      setRoomIdError(false);
      setRoomID(inputValue);
    } else {
      setRoomIdError(true);
    }
  };

  const roomIDInputStyles = roomIdError ? `${styles.inputError}` : '';

  return (
    <div className={styles.App}>
      <nav className={navStyles.nav}>
        <div className={navStyles['nav-container']}>
          <a className={navStyles.logo} href="/">
            <Image className={navStyles['logo-img']} src={logo} alt="Logo" />
          </a>
          <ul className={navStyles['nav-list']}>
            <li className={navStyles.community}>
              <a href="Community">Community</a>
            </li>
            <li className={navStyles.mypage}>
              <a href="MyPage">My Page</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className={styles['post-container']}>
        <div className={styles.newPostContainer}>
          <div className={styles.newPost}>
            <button className={styles.newPostBtn} onClick={openModal}>
              POST
            </button>
          </div>
        </div>
        <div className={styles.post}>
          <h1 className={styles['post-title']}>ditto</h1>
          <p className={styles['post-writer']}>newjeans</p>
          <p className={styles['post-date']}>2323 / 13 / 01</p>
          <p className={styles['post-content']}>
            likeyouwantsomebody너를상상햇지항상닿아있던처음느낌그대로난
          </p>
        </div>
      </div>

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
            <div className={styles.roomIdContainer}>
              <input
                type="text"
                placeholder="스터디룸 ID"
                value={roomID}
                onChange={handleRoomIDChange}
                className={roomIDInputStyles}
              />
              {roomIdError && <p className={styles.errorMessage}>* 해당 스터디룸 ID는 이미 존재합니다.</p>}
              {missingFieldsError && <p className={styles.errorMessage}>* 모든 칸을 입력해주세요.</p>}
            </div>
            <div className={styles.buttonContainer}>
              <button type="submit" disabled={roomIdError}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Render the existing posts */}
      {posts.map((post, index) => (
        <Post
          key={index}
          title={post.title}
          content={post.content}
          roomID={post.roomID}
        />
      ))}
    </div>
  );
}

export default Community;