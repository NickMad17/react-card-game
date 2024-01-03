import React from "react";
import { Link } from "react-router-dom";
import styles from './LeaderBordLink.module.css'
function LeaderBordLink({children}) {
  return (
    <Link className={styles.link} to='/leaderboard' >
      {children}
    </Link>
  );
}

export default LeaderBordLink;