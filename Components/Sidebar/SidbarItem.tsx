import Image from "next/image";

interface Props {
  styles: any;
  icon: string | JSX.Element;
  text: string;
  iconWidth?: number;
  iconHeight?: number;
  onClick: () => void;
}
export default function SidebarItem({
  styles,
  icon,
  text,
  iconWidth,
  iconHeight,
  onClick,
}: Props) {
  return (
    <>
      <div className={styles.item} onClick={onClick}>
        <span className={styles.Item__Icon}>
          {typeof icon === "string" && (
            <Image
              src={icon}
              alt="icon"
              width={iconWidth}
              height={iconHeight}
            />
          )}
          {typeof icon !== "string" && icon}
        </span>{" "}
        <span className={styles.Item__Text}>{text}</span>
      </div>
    </>
  );
}
