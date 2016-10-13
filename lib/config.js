angular.module("app.config", [])

.constant("appAuthUrl", "http://localhost:8083")

.constant("appAuthData", {
	"client_id": "human",
	"client_secret": "hum4n012345",
	"grant_type": "password",
	"scope": "read write"
})

.constant("appDataUrl", "http://localhost:8082")

;