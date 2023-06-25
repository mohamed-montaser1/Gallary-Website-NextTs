import { connect } from "mongoose";

export default function dbConnect(): Promise<any> {
  return connect(process.env.DB_URL!, { dbName: "Gallary-DB" });
}
