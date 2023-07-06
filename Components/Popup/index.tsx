import Image from "next/image";
import styles from "./Popup.module.scss";

interface Props {
  imageSrc: string;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Popup({ imageSrc, setState }: Props) {
  const handleClosePopup = (e: React.MouseEvent<HTMLDivElement>) => {
    let target = e.target as any;
    if (!(target.src as string)) {
      // hanlde close
      setState(false);
      return;
    }
  };
  return (
    <>
      <div className={styles.popup__layer} onClick={handleClosePopup}>
        <div className={styles.popup__container}>
          <Image src={imageSrc} alt={"Image You Want To Open"} fill />
        </div>
      </div>
    </>
  );
}
