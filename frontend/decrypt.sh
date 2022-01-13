mkdir src/environments
sudo gpg --output src/environments/environment.ts --decrypt --pinentry-mode=loopback secrets.ts.gpg 
sudo gpg --output src/environments/environment.prod.ts --decrypt --pinentry-mode=loopback secrets.prod.ts.gpg