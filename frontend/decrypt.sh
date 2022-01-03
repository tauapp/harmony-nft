sudo gpg --output secrets.ts --decrypt secrets.ts.gpg 
cp secrets.ts src/environments/environment.ts
sudo gpg --output secrets.prod.ts --decrypt secrets.prod.ts.gpg
cp secrets.prod.ts src/environments/environment.prod.ts