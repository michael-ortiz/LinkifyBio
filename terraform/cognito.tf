resource "aws_cognito_user_pool" "main" {
  name = "${var.app_name}-user-pool-${var.environment}"

  schema {
    attribute_data_type = "String"
    mutable             = true
    name                = "email"
    required            = true
  }

  auto_verified_attributes = ["email"]

  username_attributes = ["email"]

  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  email_configuration {
    email_sending_account = "DEVELOPER"
    from_email_address    = "LinkifyBio <no-reply@linkifybio.com>"
    source_arn            = data.aws_ses_domain_identity.identity.arn
  }
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id                     = aws_ssm_parameter.google_client_id.value
    client_secret                 = aws_ssm_parameter.google_client_secret.value
    authorize_scopes              = "profile email openid"
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    attributes_url_add_attributes = true
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer                   = "https://accounts.google.com"
    token_request_method          = "POST"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }

  idp_identifiers = ["accounts.google.com"]
}

# resource "aws_cognito_identity_provider" "facebook" {
#   user_pool_id  = aws_cognito_user_pool.main.id
#   provider_name = "Facebook"
#   provider_type = "Facebook"

#   attribute_mapping = {
#     email    = "email"
#     username = "id"
#   }

#   provider_details = {
#     client_id        = aws_ssm_parameter.facebook_client_id.value
#     client_secret    = aws_ssm_parameter.facebook_client_secret.value
#     authorize_scopes = "email"
#   }

#   idp_identifiers = ["graph.facebook.com"]
# }

resource "aws_cognito_user_pool_client" "client" {
  name = "${var.app_name}-user-pool-client-${var.environment}"

  user_pool_id = aws_cognito_user_pool.main.id

  allowed_oauth_flows  = ["code", "implicit"]
  allowed_oauth_scopes = ["email", "openid"]

  callback_urls = ["https://linkifybio.com/console/", "http://localhost:3000/console/", "http://localhost:5173/console/"]
  logout_urls   = ["https://linkifybio.com/", "http://localhost:3000/", "http://localhost:5173/"]

  allowed_oauth_flows_user_pool_client = true
  generate_secret                      = false

  refresh_token_validity = 1
  access_token_validity  = 60
  id_token_validity      = 60

  token_validity_units {
    refresh_token = "days"
    access_token  = "minutes"
    id_token      = "minutes"
  }

  supported_identity_providers = ["COGNITO", "Google"]

}

resource "aws_cognito_user_pool_domain" "main" {
  domain          = local.auth_domain_name
  certificate_arn = aws_acm_certificate.auth_cert.arn
  user_pool_id    = aws_cognito_user_pool.main.id
}


resource "aws_route53_record" "auth-cognito" {
  name    = aws_cognito_user_pool_domain.main.domain
  type    = "A"
  zone_id = data.aws_route53_zone.zone.zone_id
  alias {
    evaluate_target_health = false

    name    = aws_cognito_user_pool_domain.main.cloudfront_distribution
    zone_id = aws_cognito_user_pool_domain.main.cloudfront_distribution_zone_id
  }
}

data "aws_ses_domain_identity" "identity" {
  domain = "linkifybio.com"
}
