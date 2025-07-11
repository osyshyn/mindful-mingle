output "vpc_id" {
  description = "VPC ID created"
  value       = module.vpc.vpc_id
}

output "private_subnet_ids" {
  description = "Private subnet ids"
  value       = module.vpc.private_subnets
}

output "public_subnet_ids" {
  description = "Public subnet ids"
  value       = module.vpc.public_subnets
}

output "vpc_cidr_block" {
  description = "CIDR block of the vpc"
  value       = module.vpc.vpc_cidr_block
}
