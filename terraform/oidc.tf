locals {
  max_session_duration      = 3600
  github_provider_host      = "token.actions.githubusercontent.com"
  audience                  = "sts.amazonaws.com"
}

locals {
  github_provider_url = "https://token.actions.githubusercontent.com"
}

######################
##  GHA OIDC ROLE  ##
#####################
resource "aws_iam_role" "oidc_role" {
  name                 = "${var.app_name}-oidc-role"
  max_session_duration = local.max_session_duration
  assume_role_policy   = data.aws_iam_policy_document.trust.json
}

data "aws_iam_policy_document" "trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${var.account_id}:oidc-provider/${local.github_provider_host}"]
    }

    condition {
      test     = "StringEquals"
      variable = "${local.github_provider_host}:aud"
      values   = [local.audience]
    }

    condition {
      test     = "StringLike"
      variable = "${local.github_provider_host}:sub"
      values   = ["repo:michael-ortiz/LinkifyBio:*"]
    }
  }
}

data "aws_iam_policy_document" "permissions" {
  statement {
    effect    = "Allow"
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.app_bucket.arn]
  }
  statement {
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

resource "aws_iam_policy" "permissions" {
  name        = "${var.app_name}-s3-bucket-access-policy"
  description = "Access to S3 to publish React App"
  policy      = data.aws_iam_policy_document.permissions.json
}

resource "aws_iam_role_policy_attachment" "permissions" {
  role       = aws_iam_role.oidc_role.name
  policy_arn = aws_iam_policy.permissions.arn
}

output "oidc_iam_role" {
  value = aws_iam_role.oidc_role
}