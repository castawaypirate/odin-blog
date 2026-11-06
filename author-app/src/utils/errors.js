async function toErrors(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (Array.isArray(body)) {
    return body.map((e) => ({ msg: e?.msg ?? "Something went wrong" }));
  }
  if (body?.msg) {
    return [body];
  }
  return [{ msg: "Something went wrong" }];
}

export { toErrors };
