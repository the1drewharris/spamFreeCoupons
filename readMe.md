AnonymousCoupons Setup
======

Goal
------
Step by step instructions for cloud deployment of Anonymous Coupons app.

1: download and install Mongodb
------

Package Installation
------
0. Create MongoDb Yum Repo
```
cat > /etc/yum.repos.d/mongodb-org-4.0.repo << 'EOF'
[mongodb-org-4.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.0.asc
EOF
```

0. Confirm package version is desired
```
yum list mongodb-org
```

0. Install MongoDB Server
```
yum install -y mongodb-org
```

Firewall
------
0. Add local firewall rules

```
firewall-cmd --zone=public --add-port=27017/tcp --permanent
firewall-cmd --reload
```

Cluster Auth Keyfile
------
0. use openssl libraries to generate a keyfile
0. same keyfile to be shared across all clustered nodes

```
openssl rand -base64 741 > /var/certs/mongodb-keyfile
chown mongod:mongod /var/certs/mongodb-keyfile
chmod 600 /var/certs/mongodb-keyfile
```

Assemble a special combination pem format to create mongodb.pem
------
https://docs.mongodb.com/master/tutorial/configure-ssl/#pem-file
place the new pem file to /var/certs/mongodb.pem

Assemble a special trust_chain.pem cert file
------
* trust_chain.pem CA file contains the root CA cert
* Also contains all of the intermediary certs
* DOES NOT contain the SSL cert
* place the file to /var/certs/trust_chain.pem

Update /etc/mongodb.conf file 
------
```
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# where to write logging data.
systemLog:
   verbosity: 1
   destination: file
   logAppend: true
   path: /var/log/mongodb/mongod.log

# Where and how to store data.
storage:
   dbPath: /mongo/data
   journal:
     enabled: true

# how the process runs
processManagement:
   fork: true  # fork and run in background
   pidFilePath: /var/run/mongodb/mongod.pid  # location of pidfile

# network interfaces
net:
   port: 27017
   #bindIp: 127.0.0.1  # Listen to local interface only, comment to listen on all interfaces.
   ssl:
    mode: requireSSL
    PEMKeyFile: /var/certs/mongodb.pem
    CAFile: /var/certs/trust_chain.pem
    allowInvalidCertificates: true
    allowConnectionsWithoutCertificates: true
setParameter:
   enableLocalhostAuthBypass: true

replication:
  replSetName: prodRepl

#security:
#  authorization: enabled
#  keyFile: /var/certs/mongodb-keyfile

```

Update Mongo sysconfig
------
0. Edit the file located at /etc/sysconfig/mongod
0. Uncomment user and group lines
0. Set value of user and group to mongod

DB Path Permissions
------
0. Set mongod user and group to be the owner of the db path

```
chown -R mongod:mongod /mongo/
```

Update remote hosts
------
```
vi /etc/hosts
add the following hosts
10.144.196.15 IL1NX1MONGO01.netx.ctl.io
10.136.237.14 VA1NX1MONGO01.netx.ctl.io
10.81.97.12 WA1NX1MONGO01.netx.ctl.io
10.50.85.12 CA1NX1MONGO01.netx.ctl.io
10.56.5.12 CA2NX1MONGO01.netx.ctl.io

<any additional node ips>
```

Update localhost entry
------
```
vi /etc/hosts
append the following mongo host name
127.0.0.1   <VAR>MONGO01.local <VAR>MONGO01 mongo<X>.netx.ctl.io
```

Disable transparent huge pages
------
```
 mkdir /etc/tuned/no-thp
```
```
 echo -e "[main]\ninclude=virtual-guest\n[vm]\ntransparent_hugepages=never\n[script]\nscript=never_defrag.sh" > /etc/tuned/no-thp/tuned.conf
```
```
cat > /etc/tuned/no-thp/never_defrag.sh << 'EOF'
#!/bin/sh
. /usr/lib/tuned/functions
start() {
    echo never > /sys/kernel/mm/transparent_hugepage/defrag
    return 0
}
stop() {
    return 0
}
process $@
EOF

```

Change permisson of never_defrag shell script
------
```
chmod 755 /etc/tuned/no-thp/never_defrag.sh
```

Update the profile
------
```
tuned-adm profile no-thp
```

Verify the transparent hugepage turned off(both should have square brackets around [never])
------
```
cat /sys/kernel/mm/transparent_hugepage/defrag
cat /sys/kernel/mm/transparent_hugepage/enabled
```

Generate Cross Datacenter Firewall Policies (10)
------
```
IL1-10.144.196.15 <-> VA1-10.136.237.14
IL1-10.144.196.15 <-> WA1-10.81.97.12
IL1-10.144.196.15 <-> CA1-10.50.85.12
IL1-10.144.196.15 <-> CA2-10.56.5.12
VA1-10.136.237.14 <-> WA1-10.81.97.12
VA1-10.136.237.14 <-> CA1-10.50.85.12
VA1-10.136.237.14 <-> CA2-10.56.5.12
WA1-10.81.97.12 <-> CA1-10.50.85.12
WA1-10.81.97.12 <-> CA2-10.56.5.12
CA1-10.50.85.12 <-> CA2-10.56.5.12
```

Configure Replica Set
------

Connect to a primary node
```
mongo --ssl --sslCAFile /var/certs/trust_chain.pem --sslPEMKeyFile /var/certs/mongodb.pem --host IL1NX1MONGO01.netx.ctl.io 
```

Define replication config
```
config = { _id : "prodRepl", 
           members : [ {_id : 0, host : "IL1NX1MONGO01.netx.ctl.io:27017"}, 
		               {_id : 1, host : "VA1NX1MONGO01.netx.ctl.io:27017"}, 
					   {_id : 2, host : "WA1NX1MONGO01.netx.ctl.io:27017"},
					   {_id : 3, host : "CA1NX1MONGO01.netx.ctl.io:27017"},
					   {_id : 4, host : "CA2NX1MONGO01.netx.ctl.io:27017"}
					   ]}
```

initiate replication config definition
```
rs.initiate(config)
```

Add Users to Mongo DB
------
Connect to the primary node
```
mongo --ssl --sslCAFile /var/certs/trust_chain.pem --sslPEMKeyFile /var/certs/mongodb.pem --host IL1NX1MONGO01.netx.ctl.io 
```
Add admin user
```
db.createUser(
  {
    user: "AdminPrime",
    pwd:  "AdminsRconOut",
    "roles" : [
               {
                       "role" : "__system",
                       "db" : "admin"
               },
               {
                       "role" : "backup",
                       "db" : "admin"
               },
               {
                       "role" : "clusterAdmin",
                       "db" : "admin"
               },
               {
                       "role" : "clusterManager",
                       "db" : "admin"
               },
               {
                       "role" : "dbAdminAnyDatabase",
                       "db" : "admin"
               },
               {
                       "role" : "hostManager",
                       "db" : "admin"
               },
               {
                       "role" : "userAdminAnyDatabase",
                       "db" : "admin"
               }
       ]
  }
);

```

Update certificates
------
0. This will be similar to the original certificate setup but we will start with the secondary members of the replication set.
0. FTP the new combined key and certificate .pem file along with the combined trust chain .pem file. The trust chain should not have the server cert but all the other certs in the chain, such as the root and any intermediary certs.
0. If the new files are named differently or in a different location than the previous ones, update the Mongo config at /etc/mongod.conf to reflect the changes.
0. Restart the Mongo instance with ```systemctl restart mongod```.
0. Make sure that you can connect to the instance using ```mongo --ssl --sslCAFile /path/to/trust/chain.pem --sslPEMKeyFile /path/to/key/cert.pem --host hostname```.
0. Run the command use admin in the Mongo shell.
0. Login with ```db.auth("AdminPrime", "AdminsRconOut")```.
0. Run ```rs.status()``` and verify that the host you updated is at a good status in the repl set.
0. Repeat the steps for each secondary member and then repeat the steps on the primary host.

2: download and install node
-----

First install NVM with 

``curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash``

Restart your Terminal once before you start using NVM.

Install nodejs

``nvm install v*the right version for project*``