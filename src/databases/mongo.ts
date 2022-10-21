/** @format */

require("dotenv").config();
import { MongoClient, ServerApiVersion } from "mongodb";

class MongoDB {
  public client: Promise<MongoClient>;
  public static instance: MongoDB = new MongoDB();

  constructor() {
    this.client = MongoDB.build();
  }

  public static async build() {
    const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URLS}`;

    const conn = new MongoClient(uri, {
      zlibCompressionLevel: 5,
      // authMechanism: "DEFAULT",
      // authMechanismProperties: {},
      serverApi: ServerApiVersion.v1,
    });

    try {
      await conn.connect();
      await conn.db("admin").command({ ping: 1 });
      console.log("Conexión exitosa");
    } catch (e) {
      await conn.close();
      console.error(e);
    }

    return conn;
  }
}

export default MongoDB.instance.client;
