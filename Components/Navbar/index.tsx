import React, { FC } from "react";
import styles from "./Navbar.module.scss";
import Link from "next/link";
import { nanoid } from "nanoid";

interface Props {
  isLoggedIn: boolean;
}

const Navbar: FC<Props> = ({ isLoggedIn }) => {
  return (
    <>
      <div className={styles.navbar}>
        <Link href={"/"}>
          <h2 className={styles.logo}>Gallary</h2>
        </Link>
        {isLoggedIn && (
          <div className={styles.listContainer}>
            <Link href={"/"} className={`${styles.listItem}`} key={nanoid()}>
              Home
            </Link>
            <Link
              href={"/profile/all-photos"}
              className={styles.listItem}
              key={nanoid()}
            >
              My Profile
            </Link>
          </div>
        )}
        {!isLoggedIn && (
          <Link href={"/sign-in"}>
            <button role="button" className="btn-primary">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
