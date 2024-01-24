resource "aws_acm_certificate" "cert" {
  domain_name       = local.domain_name
  validation_method = "DNS"
  subject_alternative_names = ["www.${local.domain_name}"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "cdn_cert" {
  domain_name       = local.cdn_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "auth_cert" {
  domain_name       = local.auth_domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

data "aws_route53_zone" "zone" {
  name         = local.domain_name
  private_zone = false
}

resource "aws_route53_record" "validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_route53_record" "cdn_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.cdn_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_route53_record" "auth_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.auth_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.validation_record : record.fqdn]
}

resource "aws_acm_certificate_validation" "cdn_validation" {
  certificate_arn         = aws_acm_certificate.cdn_cert.arn
  validation_record_fqdns = [for record in aws_route53_record.cdn_validation_record : record.fqdn]
}

resource "aws_route53_record" "records" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.domain_name
      alias  = {
        name = aws_cloudfront_distribution.s3_distribution.domain_name
        zone_id = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
      }
    }
  }

  allow_overwrite = true
  name            = each.value.name
  type            = "A"
  zone_id         = data.aws_route53_zone.zone.zone_id

  alias {
    name                   = each.value.alias.name
    zone_id                = each.value.alias.zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "cdn_records" {
  for_each = {
    for dvo in aws_acm_certificate.cdn_cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.domain_name
      alias  = {
        name = aws_cloudfront_distribution.profile_images_s3_distribution.domain_name
        zone_id = aws_cloudfront_distribution.profile_images_s3_distribution.hosted_zone_id
      }
    }
  }

  allow_overwrite = true
  name            = each.value.name
  type            = "A"
  zone_id         = data.aws_route53_zone.zone.zone_id

  alias {
    name                   = each.value.alias.name
    zone_id                = each.value.alias.zone_id
    evaluate_target_health = false
  }
}