resource "aws_s3_bucket" "app_bucket_tfstate" {
  bucket = "${local.domain_name}-tfstate" 
}

resource "aws_s3_bucket_versioning" "app_bucket_tfstate" {
  bucket = aws_s3_bucket.app_bucket_tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_tfstate" {
  bucket = aws_s3_bucket.app_bucket_tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = "alias/aws/s3"
    }
  }
}

resource "aws_dynamodb_table" "tfstate_lock" {
  name           = "${var.app_name}-tfstate-lock-${var.environment}"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
