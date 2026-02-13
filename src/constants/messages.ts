export class InfoMessages {
    // Authentication & Authorization
    public static USER_SIGNUP_STARTED = "User signup started";
    public static USER_SIGNUP_SUCCESSFUL = "User signup successful";
    public static USER_LOGIN_STARTED = "User login started";
    public static USER_LOGIN_SUCCESSFUL = "User login successful";
    public static USER_TOKEN_REFRESH_STARTED = "User token refresh started";
    public static USER_TOKEN_REFRESH_SUCCESSFUL = "User token refresh successful";
    public static USER_LOGOUT_STARTED = "User login out";
    public static USER_VERIFYING = "User verifying";
    public static USER_UPDATE_STARTED = "User update started";
    public static USER_UPDATE_SUCCESSFUL = "User update successful";
    public static GOOGLE_LOGIN_STARTED = "Google login started";
    public static GOOGLE_LOGIN_SUCCESSFUL = "Google login successful";
    public static APPLE_LOGIN_STARTED = "Apple login started";
    public static APPLE_LOGIN_SUCCESSFUL = "Apple login successful";

    // Success Messages
    public static LOGOUT_SUCCESSFUL = "Log out successful";
    public static USER_VERIFICATION_SUCCESSFUL = "User verification successful";
    public static USER_BASIC_DETAILS_SENT = "User basic details sent";
}

export class ErrorMessages {
    // Authentication & Authorization
    public static USER_NOT_FOUND = "User not found";
    public static INVALID_CREDENTIALS = "Invalid email or password";
    public static UNAUTHORIZED_ACCESS = "Unauthorized access";
    public static TOKEN_EXPIRED = "Authentication token has expired";
    public static INVALID_TOKEN = "Invalid authentication token";
    public static EMAIL_NOT_FOUND = "Email not found";
    public static REFRESH_TOKEN_NOT_FOUND = "Refresh token not found";
    public static AUTHENTICATION_FAILED = "Authentication Failed || JWT Expired";
    public static AUTHORIZATION_FAILED = "Authorization Failed";
    public static AUTHORIZATION_HEADER_NOT_SET = "Authorization header not set";
    public static BEARER_PREFIX_NOT_FOUND = "Prefix \"Bearer\" is not found in authorization header";
    public static BEARER_TOKEN_NOT_FOUND = "Bearer Token not found";
    public static USER_DELETED = "Authentication Failed - User Deleted";

    // Input Validation
    public static INVALID_INPUT = "Invalid input parameters";
    public static MISSING_REQUIRED_FIELDS = "Required fields are missing";
    public static INVALID_FORMAT = "Invalid data format";
    public static VALIDATION_ERROR = "Validation failed";

    //General
    public static INTERNAL_SERVER_ERROR = "Internal server error";
}

export class HttpCodes {
    public static OK = 200;
    public static CREATED = 201;
    public static ACCEPTED = 202;
    public static NO_CONTENT = 204;
    public static MOVED_PERMANENTLY = 301;
    public static FOUND = 302;
    public static NOT_MODIFIED = 304;
    public static BAD_REQUEST = 400;
    public static UNAUTHORIZED = 401;
    public static FORBIDDEN = 403;
    public static NOT_FOUND = 404;
    public static METHOD_NOT_ALLOWED = 405;
    public static CONFLICT = 409;
    public static UNPROCESSABLE_ENTITY = 422;
    public static INTERNAL_SERVER_ERROR = 500;
    public static NOT_IMPLEMENTED = 501;
    public static BAD_GATEWAY = 502;
    public static SERVICE_UNAVAILABLE = 503;
    public static GATEWAY_TIMEOUT = 504;
}