/** @format */

require("dotenv").config();
import mysql from "mysql";

class MysqlDB {
  public client: Promise<mysql.Connection>;
  public static instance: MysqlDB = new MysqlDB();

  constructor() {
    this.client = MysqlDB.build();
  }

  public static async build() {
    const conn = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      // database: dataBase,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASS,
    });

    try {
      conn.connect(function (error) {
        if (error) throw error;
        console.log("Conexión exitosa");
      });
    } catch (e) {
      console.error(e);
    }

    return conn;
  }
}

export default MysqlDB.instance.client;
