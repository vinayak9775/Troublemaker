pipeline {
    agent any
    stages {
        stage('Check Files') {
            steps {
                sh 'ls -al'
            }
        }
        stage('Setup Python Virtual ENV for dependencies') {
            steps {
                sh '''
                    echo "Checking current workspace directory"
                    ls -al
                    cd /var/www/html/Aggregation_test_project/Troublemakers
                    chmod +x /var/www/html/Aggregation_test_project/Troublemakers/envsetup.sh
                    ./envsetup.sh
                '''
            }
        }
        stage('Setup Gunicorn Setup') {
            steps {
                sh '''
                    chmod +x gunicorn.sh
                    ./gunicorn.sh
                '''
            }
        }
        stage('Setup NGINX') {
            steps {
                sh '''
                    chmod +x nginx.sh
                    ./nginx.sh
                '''
            }
        }
    }
}
