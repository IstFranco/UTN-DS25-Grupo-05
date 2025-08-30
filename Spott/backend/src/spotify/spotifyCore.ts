import axios from "axios";
import * as qs from "querystring";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;

let appToken: { token: string; expiresAt: number } | null = null;

export async function getAppToken(): Promise<string> {
    const now = Date.now();
    if (appToken && now < appToken.expiresAt - 10_000) return appToken.token;

    const { data } = await axios.post(
        "https://accounts.spotify.com/api/token",
        qs.stringify({ grant_type: "client_credentials" }),
        {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")
        }
        }
    );

    appToken = {
        token: data.access_token,
        expiresAt: now + data.expires_in * 1000
    };
    return appToken.token;
}
