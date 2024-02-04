locals {
  domain_name = "linkifybio.com"
  cdn_domain_name = "cdn.${local.domain_name}"
  auth_domain_name = "auth.${local.domain_name}"
}

variable "app_name" {
  type = string
  default = "linkifybio"
}

variable "environment" {
  type = string
  default = "production"
}