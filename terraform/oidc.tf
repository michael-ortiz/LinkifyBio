module "github-actions-gha-oidc" {
  source  = "michael-ortiz/github-actions-oidc/aws"
  version = "~> 1.0"

  create_oidc_provider = false

  role_name = "${var.app_name}-oidc-role"

  repositories            = ["michael-ortiz/LinkifyBio"]

  oidc_role_policies_arns = [
    aws_iam_policy.gha_role_permissions.arn
  ]
}

module "github-actions-terraform-oidc" {
  source  = "michael-ortiz/github-actions-oidc/aws"
  version = "~> 1.0"

  create_oidc_provider = false

  role_name = "${var.app_name}-oidc-tf-role"

  repositories            = ["michael-ortiz/LinkifyBio"]

  oidc_role_policies_arns = [
    aws_iam_policy.gha_tf_role_permissions.arn
  ]
}

data "aws_iam_policy_document" "gha_role_permissions" {
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.app_bucket.arn]
  }
  statement {
    sid = "DeploymentPermissions"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "lambda:UpdateFunctionCode"
    ]
    resources = [
      "${aws_s3_bucket.app_bucket.arn}/*", 
      aws_lambda_function.api.arn
      ]
  }
}

resource "aws_iam_policy" "gha_role_permissions" {
  name        = "${var.app_name}-gha-permissions"
  description = "Access to S3 to publish React App"
  policy      = data.aws_iam_policy_document.gha_role_permissions.json
}

data "aws_iam_policy_document" "gha_tf_role_permissions" {
  statement {
    sid = "TerraformPermissions"
    effect = "Allow"
    actions = [
      "ssm:*",
      "dynamodb:*",
      "route53:*",
      "lambda:*",
      "cognito:*",
      "cognito-idp:*",
      "cloudfront:*",
      "acm:*",
      "s3:*"
    ]
    resources = [
      "*"
    ]
  }

  statement {
    sid = "OtherTerraformPermissions"
    effect = "Allow"
    actions = [
      "ses:GetIdentityVerificationAttributes",
      "iam:Get*",
      "iam:List*",
      "kms:Describe*",
      "kms:Get*",
      "kms:List*",
    ]
    resources = [
      "*"
    ]
  }
}


resource "aws_iam_policy" "gha_tf_role_permissions" {
  name        = "${var.app_name}-gha-tf-permissions"
  description = "Access to Resources for Terraform Deployment"
  policy      = data.aws_iam_policy_document.gha_tf_role_permissions.json
}