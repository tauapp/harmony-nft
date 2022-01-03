sudo cp src/environments/environment.ts ./secrets.ts
sudo cp src/environments/environment.prod.ts ./secrets.prod.ts
sudo gpg -c secrets.ts
sudo gpg -c secrets.prod.ts