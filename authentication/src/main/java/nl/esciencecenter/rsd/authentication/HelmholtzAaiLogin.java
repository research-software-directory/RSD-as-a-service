package nl.esciencecenter.rsd.authentication;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.util.Objects;

import net.minidev.json.JSONArray;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

import com.nimbusds.oauth2.sdk.AccessTokenResponse;
import com.nimbusds.oauth2.sdk.AuthorizationCode;
import com.nimbusds.oauth2.sdk.AuthorizationCodeGrant;
import com.nimbusds.oauth2.sdk.AuthorizationGrant;
import com.nimbusds.oauth2.sdk.Scope;
import com.nimbusds.oauth2.sdk.TokenErrorResponse;
import com.nimbusds.oauth2.sdk.TokenRequest;
import com.nimbusds.oauth2.sdk.TokenResponse;
import com.nimbusds.oauth2.sdk.auth.ClientAuthentication;
import com.nimbusds.oauth2.sdk.auth.ClientSecretBasic;
import com.nimbusds.oauth2.sdk.auth.Secret;
import com.nimbusds.oauth2.sdk.http.HTTPResponse;
import com.nimbusds.oauth2.sdk.id.ClientID;
import com.nimbusds.oauth2.sdk.token.BearerAccessToken;
import com.nimbusds.openid.connect.sdk.UserInfoRequest;
import com.nimbusds.openid.connect.sdk.UserInfoResponse;
import com.nimbusds.openid.connect.sdk.claims.UserInfo;

public class HelmholtzAaiLogin implements Login {

	private final String code;
	private final String redirectUrl;
	static final String DEFAULT_ORGANISATION = "Helmholtz";

	public HelmholtzAaiLogin(String code, String redirectUrl) {
		this.code = Objects.requireNonNull(code);
		this.redirectUrl = Objects.requireNonNull(redirectUrl);
	}

	static String getOrganisationFromEntitlements(JSONArray entitlements) {
		if (entitlements == null || entitlements.isEmpty()) {
			return DEFAULT_ORGANISATION;
		}

		// we are looking for entries like:
		// urn:geant:helmholtz.de:group:GFZ#login.helmholtz.de

		for (Object element : entitlements.toArray()) {
			String ent = element.toString();

			if (
				ent.matches("urn\\:geant\\:helmholtz\\.de\\:group.*")
				&& !ent.matches("urn\\:geant\\:helmholtz\\.de\\:group\\:Helmholtz-member.*")
			) {
				String[] splitHash = ent.split("#");

				if (splitHash.length != 2) {
					// unknown format
					continue;
				}

				// urn:geant:helmholtz.de:group:GFZ
				String[] splitGroup = splitHash[0].split(":");

				if (splitGroup.length != 5) {
					// unknown format
					continue;
				}

				// return last element
				return splitGroup[splitGroup.length - 1];
			}
		}

		return DEFAULT_ORGANISATION;
	}

	@Override
	public OpenIdInfo openidInfo() {
		UserInfo userInfo;
		String userinfoUrl;

		/* get the userinfo endpoint URL first */
		try {
			HttpRequest request = HttpRequest.newBuilder(
					URI.create(Config.helmholtzAaiWellknown())
				)
				.header("accept", "application/json")
				.build();
			HttpClient client = HttpClient.newHttpClient();
			HttpResponse<String> response;
			response = client.send(request, BodyHandlers.ofString());
			JsonElement resp = JsonParser.parseString(response.body());

			userinfoUrl = resp.getAsJsonObject().getAsJsonPrimitive("userinfo_endpoint").getAsString();
		} catch (IOException | InterruptedException e) {
			throw new RuntimeException(e);
		}

		try {
			AuthorizationCode authcode = new AuthorizationCode(code);
			URI callback = new URI(redirectUrl);
			AuthorizationGrant codeGrant = new AuthorizationCodeGrant(authcode, callback);
			ClientID clientID = new ClientID(Config.helmholtzAaiClientId());
			Secret clientSecret = new Secret(Config.helmholtzAaiClientSecret());
			ClientAuthentication clientAuth = new ClientSecretBasic(clientID, clientSecret);
			URI tokenEndpoint = new URI(Config.helmholtzAaiTokenUrl());

			Scope scopes = new Scope();

			for (String scope: Config.helmholtzAaiScopes().split(" ")) {
				scopes.add(scope);
			}

			TokenRequest request = new TokenRequest(
				tokenEndpoint, clientAuth, codeGrant, scopes
			);
			TokenResponse response = TokenResponse.parse(request.toHTTPRequest().send());

			if (!response.indicatesSuccess()) {
				TokenErrorResponse errorResponse = response.toErrorResponse();
				throw new Exception(errorResponse.getErrorObject().getDescription());
			}

			AccessTokenResponse successResponse = response.toSuccessResponse();

			URI userInfoEndpoint = new URI(userinfoUrl);
			BearerAccessToken token= successResponse.getTokens().getBearerAccessToken();
			HTTPResponse httpResponse = new UserInfoRequest(userInfoEndpoint, token)
				.toHTTPRequest()
				.send();

			UserInfoResponse userInfoResponse = UserInfoResponse.parse(httpResponse);

			if (!userInfoResponse.indicatesSuccess()) {
				throw new Exception("userinfo response was not successful");
			}

			userInfo = userInfoResponse.toSuccessResponse().getUserInfo();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		JSONArray entitlements = (JSONArray) userInfo.getClaim("eduperson_entitlement");
		String organisation = getOrganisationFromEntitlements(entitlements);

		return new OpenIdInfo(
			userInfo.getSubject().toString(),
			userInfo.getName(),
			userInfo.getEmailAddress(),
			organisation
		);
	}
}
