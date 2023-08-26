app_name="filedrop"
port=80
use_x_forwarded_for=0
require_crypto=0
abuse_email=""

turn_secret=$(openssl rand -base64 32)

while getopts n:p:e:f flag
do
    case "${flag}" in
        n) app_name=${OPTARG};;
        p) port=${OPTARG};;
        e) abuse_email=${OPTARG};;
        f) use_x_forwarded_for=1;;
        s) require_crypto=1;;
    esac
done

export PORT=${port}
export APP_NAME=${app_name}
export TURN_SECRET=${turn_secret}
export ABUSE_EMAIL=${abuse_email}
export USE_X_FORWARDED_FOR=${use_x_forwarded_for}
export REQUIRE_CRYPTO=${require_crypto}

docker-compose up --build --detach