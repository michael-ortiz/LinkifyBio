locals {
  s3_origin_id                = "linkifybio-origin"
  s3_profile_images_origin_id = "linkifybio-profiles-images-origin"
}

resource "aws_s3_bucket_acl" "app_buket_acl" {
  bucket = aws_s3_bucket.app_bucket.id
  acl    = "private"
}

resource "aws_s3_bucket_acl" "profile_pictures_buket_acl" {
  bucket = aws_s3_bucket.profile_images_bucket.id
  acl    = "private"
}

resource "aws_cloudfront_distribution" "s3_distribution" {

  origin {
    domain_name = "${local.domain_name}.s3-website-us-east-1.amazonaws.com"
    origin_id   = local.s3_origin_id

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "linkifybio.com cloudfront distribution"
  default_root_object = "index.html"

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }
  
  aliases = [local.domain_name, "www.${local.domain_name}"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate_validation.validation.certificate_arn
    ssl_support_method             = "sni-only"
  }
}

resource "aws_cloudfront_distribution" "profile_images_s3_distribution" {

  origin {
    domain_name = aws_s3_bucket.profile_images_bucket.bucket_regional_domain_name
    origin_id   = local.s3_profile_images_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "Profile images linkifybio.com cloudfront distribution"

  aliases = ["cdn.${local.domain_name}"]

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_profile_images_origin_id

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate_validation.cdn_validation.certificate_arn
    ssl_support_method             = "sni-only"
  }
}

resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for profile_images_s3_distribution"
}
