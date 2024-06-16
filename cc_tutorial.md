```bash
gcloud run deploy montir-api \
--image=asia-southeast2-docker.pkg.dev/montir-app-425014/montir/montir@sha256:204e8cf1f985169de6d43feb5c9c2624621192b88c9d38c00527141121817c50 \
    --allow-unauthenticated \
    --port=3000 \
    --service-account=116571456503-compute@developer.gserviceaccount.com \
    --min-instances=1 \
    --max-instances=4 \
    --vpc-connector=projects/montir-app-425014/locations/asia-southeast2/connectors/montir-connector \
    --vpc-egress=private-ranges-only \
    --region=asia-southeast2 \
    --project=montir-app-425014
```