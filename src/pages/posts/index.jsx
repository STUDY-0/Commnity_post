import Navbar from "@/components/Navbar";
import db from "@/net/db";
import { doc, getDoc, onSnapshot, query, collection, orderBy, addDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../../../styles/CommunityPost.module.css";
import Community from "../Community";

export default function Article() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [comment, setComment] = useState('');
  const [list, setList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, 'articles', router.query.id);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        setSubject(data.subject);
        setContent(data.content);
      } catch (error) {
        // 에러 처리
      }
    };

    fetchData();
  }, [router.query.id]);

  return (
    <div>
      <Community />
      <div className={styles.container}>
        <div className={styles.postContainer}>
          <div className={styles.post}>
            <h1 className={styles.title}>{subject}</h1>
            <hr className={styles.divider} />
            <p className={styles.content}>{content}</p>
          </div>
        </div>
        <div className={styles.comment}>
          <div className={styles.commentsList}>
            {list.map(item => (
              <div key={item.id} className={styles.commentContainer}>
                <p className={styles.commentText}>{item.comment}</p>
                <hr className={styles.commentHr} />
              </div>
            ))}
          </div>
          <div className={styles.commentsContainer}>
            <textarea className={styles.commentsInput} type='text' placeholder="댓글을 입력하세요"
              value={comment} onChange={event => setComment(event.target.value)} />
            <button className={styles.submitBtn} onClick={submit}>↖</button>
          </div>
        </div>
      </div>
    </div>
  )
}