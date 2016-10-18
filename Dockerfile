FROM centos:latest
MAINTAINER Michael Solberg <msolberg@redhat.com>

# Set this to something reasonable for your environment
ENV MONGO_URL mongodb://localhost:27017/honeybeevote

# This installs node 4 from software collections
RUN yum -y install centos-release-scl-rh; yum clean all
RUN yum -y install rh-nodejs4; yum clean all

# Set up npm for our project
RUN mkdir /code
WORKDIR /code
COPY package.json /code
RUN scl enable rh-nodejs4 'npm install'

# Copy our code into /code
COPY . /code

EXPOSE 8080

# Run our app from 'npm start'
CMD scl enable rh-nodejs4 'npm start'
