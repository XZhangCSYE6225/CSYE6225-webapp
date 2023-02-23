variable "aws_region" {
  type = string
}

variable "source_ami" {
  type = string
}

variable "ssh_username" {
  type = string
}

variable "account_id" {
  type = string
}

variable "instance_type" {
  type = string
}

variable "volume_size" {
  type = number
}

variable "volume_type" {
  type = string
}

packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

source "amazon-ebs" "webapp" {
  ami_name        = "webapp-ami-${formatdate("YYYY-MM-DD-hh-mm-ss", timestamp())}"
  ami_description = "AMI for webapp"
  source_ami      = "${var.source_ami}"
  instance_type   = "${var.instance_type}"
  region          = "${var.aws_region}"
  ssh_username    = "${var.ssh_username}"
  ami_users       = ["${var.account_id}"]

  assume_role {
    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
          {
            Effect = "Allow"
            Action = [
              "ec2:AttachVolume",
              "ec2:AuthorizeSecurityGroupIngress",
              "ec2:CopyImage",
              "ec2:CreateImage",
              "ec2:CreateKeypair",
              "ec2:CreateSecurityGroup",
              "ec2:CreateSnapshot",
              "ec2:CreateTags",
              "ec2:CreateVolume",
              "ec2:DeleteKeyPair",
              "ec2:DeleteSecurityGroup",
              "ec2:DeleteSnapshot",
              "ec2:DeleteVolume",
              "ec2:DeregisterImage",
              "ec2:DescribeImageAttribute",
              "ec2:DescribeImages",
              "ec2:DescribeInstances",
              "ec2:DescribeInstanceStatus",
              "ec2:DescribeRegions",
              "ec2:DescribeSecurityGroups",
              "ec2:DescribeSnapshots",
              "ec2:DescribeSubnets",
              "ec2:DescribeTags",
              "ec2:DescribeVolumes",
              "ec2:DetachVolume",
              "ec2:GetPasswordData",
              "ec2:ModifyImageAttribute",
              "ec2:ModifyInstanceAttribute",
              "ec2:ModifySnapshotAttribute",
              "ec2:RegisterImage",
              "ec2:RunInstances",
              "ec2:StopInstances",
              "ec2:TerminateInstances"
            ]
            Resource = "*"
          }
        ]
      })
    }

  aws_polling {
    delay_seconds = 30
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = var.volume_size
    volume_type           = "${var.volume_type}"
  }

  tags = {
    Name = "webapp-ami"
  }
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "file" {
    source      = "../webapp.zip"
    destination = "/home/ec2-user/webapp.zip"
  }

  provisioner "file" {
    source      = "./packer/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "shell" {
    environment_vars = []
    script           = "./packer/webapp.sh"
  }
}