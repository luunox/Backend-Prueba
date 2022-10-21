/** @format */

import { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { Collection, Document, Int32, Long, WithId } from "mongodb";
import ShortUniqueId from "short-unique-id";
import mongoDB from "../databases/mongo";
import { checkCvv, checkEmail, checkMonth, checkPk, checkYear, luhnCheck } from "../validators/card";

interface BodyType extends Document {
  _id?: string;
  cvv: Int32;
  email: string;
  expiration_year: Int32;
  expiration_month: Int32;
}

interface DataType extends BodyType {
  card_number: number;
}

export const postToken: APIGatewayProxyHandlerV2 = async (event) => {
  const { authorization } = event.headers;
  const data: DataType = JSON.parse(event.body || "{}");

  if (!authorization) return { statusCode: 200, body: JSON.stringify({ response: "no existe cabecera de autorización" }) };
  if (!data || Object(data).length === 0) return { statusCode: 200, body: JSON.stringify({ response: "no se recibió ningún parametro" }) };

  let coll: Collection<BodyType>;
  const client = await mongoDB;
  const db = client.db("backend");
  const uniqueID = new ShortUniqueId().stamp(16);

  if (!checkPk(uniqueID)) return { statusCode: 200, body: JSON.stringify({ response: "pk_key incorrecta" }) };
  if (!checkEmail(data.email)) return { statusCode: 200, body: JSON.stringify({ response: "email incorrecto" }) };
  if (!checkCvv(data.cvv?.valueOf())) return { statusCode: 200, body: JSON.stringify({ response: "cvv incorrecto" }) };
  if (!luhnCheck(Number(data.card_number))) return { statusCode: 200, body: JSON.stringify({ response: "tarjeta incorrecta" }) };
  if (!checkYear(data.expiration_year?.valueOf())) return { statusCode: 200, body: JSON.stringify({ response: "año incorrecto" }) };
  if (!checkMonth(data.expiration_month?.valueOf())) return { statusCode: 200, body: JSON.stringify({ response: "mes incorrecto" }) };

  try {
    const collGet = (await db.listCollections().toArray()).find((dat) => dat.name === "tokens");
    if (!collGet)
      coll = await db.createCollection<BodyType>("tokens", {
        autoIndexId: false,
        validator: {
          $jsonSchema: {
            title: "Data of a card",
            required: ["cvv", "email", "card_number", "expiration_year", "expiration_month"],
            properties: {
              cvv: { bsonType: "int", minLength: 3, maxLength: 4, description: "'cvv' es requerido" },
              email: { bsonType: "string", pattern: "^.{5,100}@(yahoo.es|hotmail.com|gmail.com)$", description: "'email' es requerido" },
              card_number: { bsonType: "long", minLength: 16, maxLength: 16, description: "'card_number' es requerido" },
              expiration_year: { bsonType: "int", minimum: new Date().getFullYear(), maximum: new Date().getFullYear() + 5, description: "'expiration_year' es requerido" },
              expiration_month: { bsonType: "int", minimum: 1, maximum: 12, description: "'expiration_month' es requerido" },
              createdAt: { bsonType: ["date"] },
            },
          },
        },
      });
    else coll = db.collection("tokens");
    await coll.createIndex({ createdAt: 1 }, { expireAfterSeconds: 15 * 60 });
    await coll.insertOne({ _id: uniqueID, ...data, card_number: Long.fromNumber(data.card_number), createdAt: new Date() });
  } catch (error) {
    return { statusCode: 200, body: JSON.stringify(error) };
  }

  return { statusCode: 200, body: JSON.stringify({ response: "token creado con éxito", token: uniqueID }) };
};

export const getToken: APIGatewayProxyHandlerV2 = async (event) => {
  const { authorization } = event.headers;

  if (!authorization) return { statusCode: 200, body: JSON.stringify({ response: "no existe cabecera de autorización" }) };

  let coll: Collection<BodyType>;
  let doc: WithId<BodyType> | null;
  const client = await mongoDB;
  const db = client.db("backend");
  const pk_Key = event.pathParameters?.pk_Key;

  if (!checkPk(pk_Key || "")) return { statusCode: 200, body: JSON.stringify({ response: "pk_Key inválida", pk_Key }) };

  try {
    const collGet = (await db.listCollections().toArray()).find((dat) => dat.name === "tokens");
    if (!collGet) return { statusCode: 200, body: JSON.stringify({ response: "No existe la colección" }) };
    else coll = db.collection("tokens");
    doc = await coll.findOne({ _id: pk_Key });
  } catch (error) {
    return { statusCode: 200, body: JSON.stringify(error) };
  }

  if (doc) return { statusCode: 200, body: JSON.stringify({ response: "token encontrado", token: { ...doc, cvv: undefined } }) };
  else return { statusCode: 200, body: JSON.stringify({ response: "token no encontrado" }) };
};
