import { buildUrl } from "build-url-ts";

export async function queryTorn(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const error = new Error("HTTP status: " + response.statusText);
    return [error, null];
  }
  const json = JSON.parse(await response.text());
  if (json.error != null) {
    const error = new Error("Torn status: " + String(json.error.error));
    return [error, null];
  }
  return [null, json];
}

export async function getLogInfo(
  api: string,
  user: number,
  from: number,
  to: number,
  logTypes: number[]
) {
  const url = buildUrl("https://api.torn.com/", {
    path: "user/" + String(user),
    queryParams: {
      selections: "log",
      key: api,
      log: logTypes,
      from,
      to,
      comment: "panaka_13"
    }
  });
  const [error, json] = await queryTorn(url);
  if (error !== null) {
    return [error, json];
  }
  return [null, json.log];
}

export async function getEventInfo(api: string, user: number, from: number, to: number) {
  const url = buildUrl("https://api.torn.com/", {
    path: "user/" + String(user),
    queryParams: {
      selections: "events",
      key: api,
      from,
      to,
      comment: "panaka_13"
    }
  });
  const [error, json] = await queryTorn(url);
  if (error !== null) {
    return [error, json];
  }
  return [null, json.events];
}
