resource "aws_dynamodb_table" "bio_links" {
  name           = "${var.app_name}-bio-links-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  attribute {
    name = "owner"
    type = "S"
  }

  global_secondary_index {
    name               = "AdminIndex"
    hash_key           = "id"
    range_key          = "owner"
    projection_type    = "ALL"
  }
}