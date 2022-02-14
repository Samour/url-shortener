
CS_VERSION=$(echo -n "$VERSION" | tr '_' '-')
CHANGE_SET_NAME="${SERVICE_NAME}-app-${CS_VERSION}"

cs-report() {
  aws cloudformation --output $1 \
    describe-change-set \
    --change-set-name $CHANGE_SET_NAME \
    --stack-name ${SERVICE_NAME}-app
}

cs-status() {
  cs-report json | jq ".Status"
}
