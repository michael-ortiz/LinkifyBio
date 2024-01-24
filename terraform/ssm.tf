resource "aws_ssm_parameter" "google_client_id" {
  name  = "/${var.app_name}/cognito/google/client_id"
  type  = "String"
  value = "initial-value"

  lifecycle {
    ignore_changes = [value]
  }
}

resource "aws_ssm_parameter" "google_client_secret" {
  name  = "/${var.app_name}/cognito/google/client_secret"
  type  = "SecureString"
  value = "initial-value"

  lifecycle {
    ignore_changes = [value]
  }
}

# resource "aws_ssm_parameter" "facebook_client_id" {
#   name  = "/${var.app_name}/cognito/facebook/client_id"
#   type  = "String"
#   value = "initial-value"

#   lifecycle {
#     ignore_changes = [value]
#   }
# }

# resource "aws_ssm_parameter" "facebook_client_secret" {
#   name  = "/${var.app_name}/cognito/facebook/client_secret"
#   type  = "SecureString"
#   value = "initial-value"

#   lifecycle {
#     ignore_changes = [value]
#   }
# }