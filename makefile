dev:
	npm run dev
serve:
	git pull
	npm run build
	npx pm2 reload nuxt-app
build:
	npm run build
start:
	npx pm2 start
stop:
	npx pm2 stop nuxt-app
reload:
	npx pm2 reload nuxt-app
install:
	npm install
git:
	git add .
	git commit && git push -u origin main