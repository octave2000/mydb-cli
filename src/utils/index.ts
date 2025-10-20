function oauthSignIn() {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id:
      "1044296166148-pidlfu0hhd558f9j7hh726k7khu7udtm.apps.googleusercontent.com",

    redirect_uri: "http://localhost:3000",
    scope: "openid profile email",

    response_type: "token",

    prompt: "consent",

    state: "pass-through-value-" + Date.now().toString(),

    include_granted_scopes: "true",
  };

  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${oauth2Endpoint}?${urlParams}`;

  console.log(`Open the following URL to log in:\n${fullUrl}`);
}

oauthSignIn();
