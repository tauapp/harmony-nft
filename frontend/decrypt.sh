mkdir src/environments
sudo gpg --output src/environments/environment.ts --decrypt secrets.ts.gpg 
sudo gpg --output src/environments/environment.prod.ts --decrypt secrets.prod.ts.gpg