resource "aws_lambda_function" "api" {
  function_name = "${var.app_name}-api-${var.environment}"
  handler       = "index.handler"
  runtime       = "nodejs20.x"

  filename = data.archive_file.empty_zip.output_path

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      BIO_LINKS_TABLE_NAME       = aws_dynamodb_table.bio_links.name
      PROFILE_IMAGES_BUCKET_NAME = aws_s3_bucket.profile_images_bucket.id
      CDN_DOMAIN_NAME            = local.cdn_domain_name
    }
  }

  lifecycle {
    ignore_changes = [filename]
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_exec_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb_access" {
  name = "${var.app_name}-permissions"
  role = aws_iam_role.lambda_exec.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:DescribeTable",
        ],
        Resource = aws_dynamodb_table.bio_links.arn
      },
      {
        Effect = "Allow",
        Action = [
          "s3:PutObject"
        ],
        Resource = [
          "${aws_s3_bucket.profile_images_bucket.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_lambda_function_url" "url" {
  function_name      = aws_lambda_function.api.function_name
  authorization_type = "NONE"
}

data "archive_file" "empty_zip" {
  type        = "zip"
  output_path = "/tmp/empty.zip"
  source {
    content  = ""
    filename = "empty.txt"
  }
}
