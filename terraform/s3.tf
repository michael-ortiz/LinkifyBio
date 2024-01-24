resource "aws_s3_bucket" "app_bucket" {
  bucket = local.domain_name
}

resource "aws_s3_bucket" "profile_images_bucket" {
  bucket = "${local.domain_name}-profile-images"
}

resource "aws_s3_bucket_website_configuration" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_website_configuration" "profile_images_bucket" {
  bucket = aws_s3_bucket.profile_images_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

resource "aws_s3_bucket_public_access_block" "app_bucket_access_block" {
  bucket = aws_s3_bucket.app_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_public_access_block" "profile_images_bucket_access_block" {
  bucket = aws_s3_bucket.profile_images_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_ownership_controls" "app_bucket" {
  bucket = aws_s3_bucket.app_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_ownership_controls" "profile_images_bucket" {
  bucket = aws_s3_bucket.profile_images_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_policy" "app_bucket_policy" {
  bucket = aws_s3_bucket.app_bucket.id
  policy = data.aws_iam_policy_document.app_bucket_policy_document.json
}

resource "aws_s3_bucket_policy" "profile_images_bucket_policy" {
  bucket = aws_s3_bucket.profile_images_bucket.id
  policy = data.aws_iam_policy_document.profile_images_bucket_policy_document.json
}

data "aws_iam_policy_document" "app_bucket_policy_document" {
  statement {
    sid       = ""
    effect    = "Allow"
    resources = ["${aws_s3_bucket.app_bucket.arn}/*"]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    actions = [
      "s3:GetObject",
    ]
  }
}

data "aws_iam_policy_document" "profile_images_bucket_policy_document" {
  statement {
    sid    = "Allow CloudFront Access"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.oai.iam_arn]
    }
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.profile_images_bucket.arn}/*"]
  }
}
