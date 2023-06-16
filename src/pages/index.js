// 게시물 내용 표시
import Community from "./Community";
import db from "@/net/db";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../styles/Community.module.css";

export default function Article() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [postContent, setPostContent] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'articles', router.query.id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setSubject(data.title);
        setPostContent(data.content);
      } catch (error) {
        // 에러 처리
      }
    };

    fetchData();
  }, [router.query.id]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year} / ${month} / ${day}`;
  };

  // showModal, title, content, roomID를 받아와 출력
  const { showModal, title, roomID } = router.query;

  return (
    <div>
      <Community />
      {showModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>{title}</h2>
            <p className={styles.modalContent}>{postContent}</p>
            <p className={styles.modalRoomID}>Room ID: {roomID}</p>
          </div>
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.postContainer}>
          {showModal ? (
            <div className={styles.post}>
              <h1 className={styles['post-title']}>{subject}</h1>
              <p className={styles['post-writer']}>{displayName}</p>
              <p className={styles['post-date']}>{formatDate(new Date().getTime())}</p>
              <p className={styles['post-content']}>{postContent}</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}