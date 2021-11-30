.PHONY: build clean deploy

build:
	env GOOS=linux go build -ldflags="-s -w" -o bin/getRows getRows/*.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/insertRow insertRow/*.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/generateMatches generateMatches/*.go
	env GOOS=linux go build -ldflags="-s -w" -o bin/resetGUID resetGUID/*.go

clean:
	rm -rf ./bin

deploy: clean build
	serverless deploy
