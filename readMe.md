Spam Free Coupons Setup
======

Goal
------
Step by step instructions for cloud deployment of Anonymous Coupons app.

1: download and install Mongodb
------

make sure your packages are up-to-date.

``sudo apt update && sudo apt upgrade -y``

install MongoDB

``sudo apt install mongodb``

to modify it’s state use the following commands

``sudo systemctl status mongodb``

``sudo systemctl stop mongodb``

``sudo systemctl start mongodb``

``sudo systemctl restart mongodb``

2: download and install node
-----

First install NVM with 

``curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash``

Restart your Terminal once before you start using NVM.

Install nodejs

``nvm install v*the right version for project*``

3: pull project from git
-----

install git

``sudo apt install git-all``

cd into the file where you want to store the project

``cd /home/user/my_project``

clone repository:

``git clone https://github.com/the1drewharris/anonymousCoupons.git``

4: run project
-----

cd to project folder

``cd /home/user/my_project/anonymousCoupons``

to run mongo run the command:

``mongod``

then start node with:

``node server.js``
