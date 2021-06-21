pipeline {
    agent {
        node { label 'aws && build && linux && ubuntu' }
    }
    parameters {
        booleanParam(name: 'SKIP_BUILD', defaultValue: false, description: 'Skips Docker builds')
        string(name: 'AWS_REGION', defaultValue: 'us-east-1', description: 'AWS Region to deploy')
        string(name: 'KUBERNETES_CLUSTER_NAME', defaultValue: 'kube-eks-ci-compute', description: 'Kubernetes cluster to deploy')
    }
    environment {
        PROJECT_NAME = "WIPP-frontend"
        ARTIFACT_PATH = "deploy/docker"
        DOCKER_VERSION = readFile(file: 'deploy/docker/VERSION').trim()
    }
    triggers {
        pollSCM('H/2 * * * *')
    }
    stages {
        stage('Build Version') {
            steps{
                script {
                    def packageJSON = readJSON(file: 'package.json')
                    def artifactVersion = packageJSON.version
                    env.ARTIFACT_VERSION = artifactVersion
                    BUILD_VERSION_GENERATED = VersionNumber(
                        versionNumberString: 'v${BUILD_YEAR, XX}.${BUILD_MONTH, XX}${BUILD_DAY, XX}.${BUILDS_TODAY}',
                        projectStartDate:    '1970-01-01',
                        skipFailedBuilds:    true)
                    currentBuild.displayName = BUILD_VERSION_GENERATED
                    env.BUILD_VERSION = BUILD_VERSION_GENERATED
                }
            }
        }
        stage('Checkout source code') {
            steps {
                cleanWs()
                checkout scm
            }
        }
        stage('Build NPM Artifact') {
            when {
                environment name: 'SKIP_BUILD', value: 'false'
            }
            steps {
                configFileProvider([configFile(fileId: '2e7ca7c3-751d-46bf-a8ed-94faa706ba22', targetLocation: 'artifactory_url')]) {
                    script {
                        env.ARTIFACTORY_URL = readFile(file: 'artifactory_url')
                    }
                }
                withCredentials([string(credentialsId: 'ARTIFACTORY_USER', variable: 'ARTIFACTORY_USER'),
                                    string(credentialsId: 'ARTIFACTORY_TOKEN', variable: 'ARTIFACTORY_TOKEN')]) {
                    script {
                        sh 'npm ci'
                        sh 'npm run ng build wipp-frontend-lib'
                        sh 'npm run ng build -- --prod'
                        sh 'tar -czf ${ARTIFACT_PATH}/${PROJECT_NAME}.tar.gz -C dist .'
                        sh "curl -u${ARTIFACTORY_USER}:${ARTIFACTORY_TOKEN} -T ${ARTIFACT_PATH}/${PROJECT_NAME}.tar.gz ${ARTIFACTORY_URL}/${PROJECT_NAME}/${ARTIFACT_VERSION}.tar.gz"
                    }
                }
            }
        }
        stage('Build Docker') {
            when {
                environment name: 'SKIP_BUILD', value: 'false'
            }
            steps {
                dir('deploy/docker') {
                    withCredentials([string(credentialsId: 'ARTIFACTORY_USER', variable: 'ARTIFACTORY_USER'),
                                        string(credentialsId: 'ARTIFACTORY_TOKEN', variable: 'ARTIFACTORY_TOKEN')]) {
                        script {
                            docker.withRegistry('https://registry-1.docker.io/v2/', 'f16c74f9-0a60-4882-b6fd-bec3b0136b84') {
                                def image = docker.build("labshare/wipp-frontend:latest", "--build-arg ARTIFACTORY_USER=${ARTIFACTORY_USER} --build-arg ARTIFACTORY_TOKEN=${ARTIFACTORY_TOKEN} --no-cache ./")
                                image.push()
                                image.push(env.DOCKER_VERSION)
                            }
                        }
                    }
                }

            }
        }
        stage('Deploy WIPP to AWS CI') {
            steps {
                configFileProvider([configFile(fileId: 'env-ci', targetLocation: '.env')]) {
                    withAWS(credentials:'aws-jenkins-eks') {
                        sh "aws --region ${AWS_REGION} eks update-kubeconfig --name ${KUBERNETES_CLUSTER_NAME}"
                        sh "./deploy.sh"
                    }
                }
            }
        }
        // stage('Deploy WIPP to NCATS') {
        //     agent {
        //         node { label 'ls-api-ci.ncats' }
        //     }
        //     steps {
        //         configFileProvider([configFile(fileId: 'env-single-node', targetLocation: '.env')]) {
        //             withKubeConfig([credentialsId: 'ncats_polus2']) {
        //                 sh "./deploy.sh"
        //             }
        //         }
        //     }
        // }
    }
}
