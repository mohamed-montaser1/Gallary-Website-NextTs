import React from "react";
import styles from "./Sidebar.module.scss";
import SidebarItem from "./SidbarItem";
import useStorage from "@/hooks/useStorage";
import { useRouter } from "next/router";
import { nanoid } from "nanoid";

interface Props {
  isLoggedIn: boolean;
}

export default function Sidebar({ isLoggedIn }: Props) {
  let router = useRouter();
  if (!isLoggedIn) {
    return "";
  }
  const handleSignout = () => {
    useStorage.clear();
    location.reload();
  };
  return (
    <aside className={styles.aside}>
      <div className={styles.container}>
        <div>
          <SidebarItem
            text="My Photos"
            icon={"/icons/image-icon.svg"}
            styles={styles}
            iconWidth={18.67}
            iconHeight={14}
            key={nanoid()}
            onClick={() => {
              router.push("/profile/all-photos");
            }}
          />
          <SidebarItem
            text="Create Photo"
            icon={"/icons/edit-icon.svg"}
            styles={styles}
            iconWidth={18.67}
            iconHeight={18.67}
            key={nanoid()}
            onClick={() => {
              router.push("/profile/create-post");
            }}
          />
        </div>
        <div>
          <SidebarItem
            text="Sign Out"
            icon={"/icons/exit-icon.svg"}
            styles={styles}
            iconWidth={18.67}
            iconHeight={18.67}
            key={nanoid()}
            onClick={handleSignout}
          />
          <SidebarItem
            text="Control Panel"
            icon={"/icons/control-icon.svg"}
            styles={styles}
            iconWidth={18.67}
            iconHeight={18.67}
            key={nanoid()}
            onClick={() => {}}
          />
        </div>
      </div>
    </aside>
  );
}
