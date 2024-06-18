## Set environment variables

```bash
export PROJECT_ID=$(gcloud config get-value project)
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format 'value(projectNumber)')
export REGION=asia-southeast2
```

## GCS setup

1. Make bucket.

    ```bash
    gsutil mb -l asia -b on gs://montir
    ```

2. Upload the .sql file in this folder.

## Cloud SQL setup

1. Allocate IP address range.

    ```bash
    gcloud compute addresses create montir-ip \
        --global \
        --purpose=VPC_PEERING \
        --prefix-length=20 \
        --network=projects/$PROJECT_ID/global/networks/default
    ```

2. Create private connection.

    ```bash
    gcloud services vpc-peerings connect \
        --service=servicenetworking.googleapis.com \
        --ranges=montir-ip \
        --network=default \
        --project=$PROJECT_ID
    ```

3. Create MySQL instance.

   ```bash
   gcloud sql instances create montir-sql \
        --project=$PROJECT_ID \
        --network=projects/$PROJECT_ID/global/networks/default \
        --no-assign-ip \
        --database-version=MYSQL_8_0 \
        --cpu=2 \
        --memory=4GB \
        --region=$REGION \
        --root-password=montir123
    ```

4. Create database.

    ```bash
    gcloud sql databases create montir-db --instance=montir-sql
    ```

5. Create user.

    ```bash
    gcloud sql users create montir \
        --password=montir123 \
        --instance=montir-sql
    ```

6. Import MySQL database.

    1. Click the sql instance you just created.
    2. In the Overview, click Import from the top menu.
    3. Browse and select the .sql file uploaded before.
    4. For destination, choose montir-db.
    5. Click import.

7. Show SQL instance IP, copy and save for later use.

    ```bash
    gcloud sql instances describe montir-sql \
        --format=json | jq \
        --raw-output ".ipAddresses[].ipAddress"
    ```

8. Add Cloud SQL Client role to Compute Engine service account.

    ```bash
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
        --role="roles/cloudsql.client"
    ```

9. Create Serverless VPC Access connector.

    ```bash
    gcloud compute networks vpc-access connectors create montir-connector \
        --region=${REGION} \
        --range=10.8.0.0/28 \
        --min-instances=2 \
        --max-instances=3 \
        --machine-type=f1-micro
    ```

## Artifact Registry

Create Artifact Registry repository.

```bash
gcloud artifacts repositories create montir \
    --location=$REGION \
    --repository-format=docker 
```

## App Engine Setup

### Model

- In Cloud Shell

    1. Clone project repo from GitHub.

        ```bash
        git clone -b cc https://github.com/EurekaCHWARD/Montir.git Montir

        cd Montir/Model
        ```

    2. Deploy the model into App Engine.

        ```bash
        gcloud app deploy
        ```

        If asked "Please choose the region where you want your App Engine application located"

        Choose asia-southeast1

        If prompted, type 'y'

## Cloud Run Setup

### API

- In Cloud Shell

    1. If already clone the project.

        ```bash
        cd

        cd Montir/API
        export PROJECT_ID=$(gcloud config get-value project)
        ```

    Then skip step number 2.

    2. Clone project repo from GitHub.

        ```bash
        git clone -b cc https://github.com/EurekaCHWARD/Montir.git Montir

        cd Montir/API 
        export PROJECT_ID=$(gcloud config get-value project)
        ```

    3. Change the URL in this block of code using your deployed model.

        ```bash
        // Call the Flask endpoint to get the quality score
        const response = await axios.post(
            "https://montir-app-69420.as.r.appspot.com/predict",
            predictionData
        );
        const quality_score = response.data.quality_score;
        ```

    3. Create `.env` file.

        ```bash
        DB_HOST=#SQL instance IP address, check above.
        DB_USER=montir
        DB_PASSWORD=montir123
        DB_DATABASE=montir-db
        DB_PORT=3306
        SECRET_STRING = 'secret string'
        SECRET_STRING_ADMIN = 'secret string admin'
        ```

    3. Build and push Docker image.

        ```bash
        docker build -t montir/montir:v1 .

        docker tag montir/montir:v1 asia-southeast2-docker.pkg.dev/$PROJECT_ID/montir/montir:v1
        docker push asia-southeast2-docker.pkg.dev/$PROJECT_ID/montir/montir:v1
        ```

- In GCP

    1. Open Cloud Run
    2. Click "Create Service"
    3. Click "Select" for Cointainer Image URL, and choose the Image.
    4. Name the service however you want.
    5. For Region, choose asia-southeast2.
    6. For Aauthentication, select "Allow unauthenticated invocations".
    7. Click "Container(s)", change the Container Port to 3000, go down to "Revision autoscalling" and change the max instances to 4.
    8. Click "Networking", select the "Connect to a VPC for outbound traffic" then choose "Use Serverless VPC Access connectors", in the Network option, find the default connector that says "... montir-connector".
    9. Finally, click "Deploy"