import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStorage from "@/hooks/useStorage";

export default function Page() {
  let router = useRouter();
  useEffect(() => {
    if (process.browser) {
      useStorage.getItem("isLoggedIn")?.startsWith("true")
        ? router.push("/profile/all-photos")
        : router.back();
    }
  }, []);
}
