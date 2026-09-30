// Type di .well-known/openid-configuration
export interface OpenIDConfiguration {
    issuer: string;
    authorization_endpoint: string;
    token_endpoint: string;
    jwks_uri: string;
    subject_types_supported: string[];
    response_types_supported: string[];
    claims_supported: string[];
    grant_types_supported: string[];
    response_modes_supported: string[];
    userinfo_endpoint: string;
    scopes_supported: string[];
    token_endpoint_auth_methods_supported: string[];
    userinfo_signing_alg_values_supported: string[];
    id_token_signing_alg_values_supported: string[];
    request_parameter_supported: boolean;
    request_uri_parameter_supported: boolean;
    require_request_uri_registration: boolean;
    claims_parameter_supported: boolean;
    revocation_endpoint: string;
    backchannel_logout_supported: boolean;
    backchannel_logout_session_supported: boolean;
    frontchannel_logout_supported: boolean;
    frontchannel_logout_session_supported: boolean;
    end_session_endpoint: string;
    request_object_signing_alg_values_supported: string[];
    code_challenge_methods_supported: string[];
}
