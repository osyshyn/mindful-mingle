locals {
  env    = terraform.workspace
  name   = "${var.REPO_NAME}" 
  tags   = { Env = terraform.workspace , Terraform = true }
  domain = "${var.domain}"
}

module "vpc" {
  source = "./modules/vpc"
  name   = local.name
}

module "ec2" {
  source = "./modules/ec2"

  SSH_KEY        = var.SSH_KEY
  SSH_KEY_PUB    = var.SSH_KEY_PUB
  REPO_NAME      = var.REPO_NAME
  FULL_REPO_NAME = var.FULL_REPO_NAME
  name           = local.name
  type           = var.type
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.public_subnet_ids
  tags           = local.tags
  ports          = var.ports
  domain         = local.domain
  depends_on     = [
    module.vpc
  ]
}




# module "fe" {
#   source = "./modules/s3/"
#   name   = "${local.name}-fe-website"
# }

# module "fe-redirect" {
#   source = "./modules/s3/"
#   name   = "${local.name}-fe-redirect"
# }

# module "acm-cert-cf" {
#   source = "./modules/cert/"
#   providers = {
#     aws = aws.us-east-1
#   }
#   domain = local.domain
#   tags   = local.tags
# }

# module "acm-cert" {
#   source = "./modules/cert/"
#   domain = local.domain
#   tags   = local.tags
# }

# module "cloudfront" {
#   source        = "./modules/cloudfront/"
#   cert_arn      = module.acm-cert-cf.cert_id
#   s3_bucket_url = module.fe.bucket_endpoint
#   aliases       = ["app-${local.env}.${local.domain}",  "app.${local.domain}", "${local.domain}"]
#   tags          = local.tags
# }

# module "cloudfront-redirect" {
#   source        = "./modules/cloudfront/"
#   cert_arn      = module.acm-cert-cf.cert_id
#   s3_bucket_url = module.fe-redirect.bucket_endpoint
#   aliases       = ["www.${local.domain}"]
#   tags          = local.tags
# }
