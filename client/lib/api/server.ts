import { cookies } from "next/headers";

import { apiRequest } from "./client";

type ApiRequestOptions = Parameters<typeof apiRequest>[0];

export async function serverApiRequest<T>(
options: ApiRequestOptions,
): Promise<T> {
const cookieStore = await cookies();

const accessToken = cookieStore.get("access_token")?.value;

const headers = new Headers(options.headers);

if (accessToken) {
headers.set("Authorization", `Bearer ${accessToken}`);
}

return apiRequest<T>({
...options,
headers,
});
}
