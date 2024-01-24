resource "aws_s3_bucket" "app_bucket_tfstate" {
  bucket = "${local.domain_name}-tfstate" 
}

resource "aws_s3_bucket_versioning" "app_bucket_tfstate" {
  bucket = aws_s3_bucket.app_bucket_tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_kms_key" "tfstate_key" {
  description             = "This key is used to encrypt bucket objects"
  deletion_window_in_days = 10
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app_bucket_tfstate" {
  bucket = aws_s3_bucket.app_bucket_tfstate.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = aws_kms_key.tfstate_key.arn
      sse_algorithm     = "aws:kms"
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