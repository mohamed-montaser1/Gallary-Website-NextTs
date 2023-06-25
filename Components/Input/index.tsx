"use client";

import React, { FC, FocusEvent, useRef } from "react";
import styles from "./Input.module.scss";
import ValidationError from "@/lib/ValidationError";
import { FaEye } from "react-icons/fa";

interface Props {
  small: string;
  placeholder: string;
  type: "text" | "password" | "file";
  style?: Object;
  state?: string;
  setState?: React.Dispatch<React.SetStateAction<string>>;
  maxLength?: number;
}

type validationFunction = (e: FocusEvent<HTMLInputElement>) => void;

const Input: FC<Props> = ({
  small,
  placeholder,
  type,
  style,
  state,
  setState,
  maxLength,
}) => {
  let errorPRef = useRef<HTMLParagraphElement>(null);
  let smallRef = useRef<HTMLElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  const validation: validationFunction = (
    e: FocusEvent<HTMLInputElement>
  ): void => {
    if (e.target.value === "") {
      let error = new ValidationError(
        `Please Fill In The ${small.toLowerCase()} Input!`
      );
      // Checking if Input Value is Empty
      if (errorPRef.current && smallRef.current && inputRef.current) {
        errorPRef.current.innerText = error.message;
        smallRef.current.style.color = "rgb(232, 38, 31)";
        inputRef.current.style.border = "1px solid rgb(232, 38, 31)";

        return;
      }
    } else {
      if (errorPRef.current) {
        if (errorPRef.current && smallRef.current && inputRef.current) {
          errorPRef.current.innerText = "";
          smallRef.current.style.color = "#17e381";
          inputRef.current.style.border = "1px solid #17e381";
        }
      }
    }
    // checking if the email is valid one
    if (small.toLowerCase().trim() === "email") {
      let pattern = /^([a-zA-Z0-9\._]+)@([a-zA-Z0-9])+.([a-z]+)?$/;
      if (inputRef.current && smallRef.current) {
        let isValid = pattern.test(inputRef.current.value);
        if (!isValid) {
          let error = new ValidationError("Email Is Not Valid!");
          if (errorPRef.current) {
            errorPRef.current.innerText = error.message;
          }
          smallRef.current.style.color = "rgb(232, 38, 31)";
          inputRef.current.style.border = "1px solid rgb(232, 38, 31)";
        } else {
          if (errorPRef.current && smallRef.current && inputRef.current) {
            errorPRef.current.innerText = "";
            smallRef.current.style.color = "#17e381";
            inputRef.current.style.border = "1px solid #17e381";
          }
        }
      }
      return;
    }
    if (small.toLowerCase().trim() === "password") {
      if (inputRef.current && smallRef.current && errorPRef.current) {
        if (inputRef.current.value.length < 6) {
          let error = new ValidationError(
            "Password Should Be Bigger Than 6 chars"
          );
          errorPRef.current.innerText = error.message;
          smallRef.current.style.color = "rgb(232, 38, 31)";
          inputRef.current.style.border = "1px solid rgb(232, 38, 31)";

          return;
        }
      }
    }
  };
  const showPassword = () => {
    if (type == "text") {
      type = "password";
      if (inputRef.current) {
        inputRef.current.type = type;
      }
      return;
    }
    type = "text";
    if (inputRef.current) {
      inputRef.current.type = type;
    }
  };
  return (
    <>
      <div className={styles.inputContainer} style={style}>
        <small className={styles.small} ref={smallRef}>
          {small}
        </small>
        <input
          className={styles.input}
          type={type}
          placeholder={placeholder}
          autoComplete={"off"}
          autoFocus
          name={`${type} input type`}
          maxLength={maxLength}
          onBlur={validation}
          ref={inputRef}
          onChange={(e) => (setState ? setState(e.target.value) : "")}
        />
        {type === "password" && (
          <button
            className={`btn-primary ${styles.showHidden}`}
            onClick={showPassword}
          >
            <FaEye />
          </button>
        )}
        <p className={styles.error} ref={errorPRef}></p>
      </div>
    </>
  );
};

export default Input;
