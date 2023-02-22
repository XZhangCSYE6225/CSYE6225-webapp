variable "aws_region" {
  type    = string
}

variable "source_ami" {
  type    = string
}

variable "ssh_username" {
  type    = string
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
  ami_name        = "webapp-ami-1"
  ami_description = "AMI for webapp"
  source_ami      = "${var.source_ami}"
  instance_type   = "t2.micro"
  region          = "${var.aws_region}"
  ssh_username    = "${var.ssh_username}"

  aws_polling {
    delay_seconds = 30
    max_attempts  = 50
  }

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.webapp"]

  provisioner "file" {
    source      = "./packer/webapp.zip"
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