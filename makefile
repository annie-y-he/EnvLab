dev:
	npm run dev
build:
	npm run build
server:
	http-server ./dist
install:
	npm install
git:
	git add .
	git commit && git push -u origin main