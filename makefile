dev:
	npm run dev
serve:
	git pull
	npx pm2 stop nuxt-app
	npm run build
	npx pm2 start
build:
	npm run build
start:
	npx pm2 start
stop:
	npx pm2 stop nuxt-app
install:
	npm install
git:
	git add .
	git commit && git push -u origin main