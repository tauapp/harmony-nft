GREEN="\033[0;32m"
NC='\033[0m'
echo "-----\n${GREEN}Initializing\n-----\n${NC}" 
npm i -g @angular/cli
cd backend
yarn
cd ../frontend
yarn
cd ..