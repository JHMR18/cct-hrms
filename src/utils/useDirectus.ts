import { authentication, createDirectus, logout, readMe, refresh, rest } from "@directus/sdk";

export const client = createDirectus("http://localhost:8055")
  .with(rest({ credentials: "include" }))
  .with(authentication("json", { credentials: "include" }));

export const getCurrentUser = async () => {
  return await client.request(
    readMe({
      fields: ["*"],
    })
  );
};

export const refreshToken = async () => {
  const response = await client.request(
    refresh("json", sessionStorage.getItem("refresh_token") ?? "")
  );

  sessionStorage.setItem("access_token", response.access_token?.toString() ?? "");
  sessionStorage.setItem("refresh_token", response.refresh_token?.toString() ?? "");
};

export const processLogout = async () => {
  try {
    const refresh_token = sessionStorage.getItem("refresh_token");

    await client.request(logout(refresh_token, "json"));

    sessionStorage.clear();
  } catch (e) {
    console.log(e);
  }
};
