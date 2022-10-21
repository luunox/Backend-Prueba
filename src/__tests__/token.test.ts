/** @format */

jest.setTimeout(60000);

import axios, { AxiosRequestConfig } from "axios";
const baseURL = `http://localhost:${process.env.PORT || 3000}`;
let token: string;

describe("Backend tests", () => {
  it("Test POST token", async () => {
    // Config
    const config: AxiosRequestConfig<{}> = {
      baseURL,
      headers: { Authorization: "Bearer pk_test_bsREWjreJrtkYUhdVEW", "Content-Type": "application/json" },
      data: { email: "test2@gmail.com", card_number: 4557880819087671, cvv: 1234, expiration_year: 2025, expiration_month: 12 },
    };

    // Act
    const res = await axios("/tokens", { method: "post", ...config });
    token = res.data.token;

    // Assert
    expect(res.status).toBe(200);
    expect(res.data.response).toBe("token creado con éxito");
  });

  it("Test GET token", async () => {
    // Config
    const config: AxiosRequestConfig<{}> = {
      baseURL,
      headers: { Authorization: "Bearer pk_test_bsREWjreJrtkYUhdVEW" },
    };

    // Act
    const res = await axios(`/tokens/${token}`, { method: "get", ...config });

    // Assert
    expect(res.status).toBe(200);
    expect(res.data.response).toBe("token encontrado");
  });
});
