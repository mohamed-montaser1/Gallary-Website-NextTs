import { connect } from "mongoose";
let { DB_URL } = process.env;

if (!DB_URL) {
  throw new Error("You Must add Db Url to .env file");
}

export default function dbConnect(): Promise<any> {
  return connect(DB_URL!, { dbName: "Gallary-DB" })
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.log("error while connecting with db", e);
    });
}
