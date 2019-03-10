
pipeline {

    agent {
        node { label 'aws && build && linux && ubuntu'}
    }

    stages {
        stage('Pre-requisites') {
            steps {
		//sh 'echo "Installing pre-requisites "'
		//sh 'sudo apt-get update'
		//sh 'sudo apt-get install docker.io -y'
		//sh 'sudo apt-get install nodejs npm -y'
              sh 'npm install -g @angular/cli'
		
            }
        }
        stage('Build App') {
            steps {
                
		    sh 'ng build'
            }
        }
        stage('Docker build') {
            steps {
                script {
			docker.withRegistry('https://684150170045.dkr.ecr.us-east-1.amazonaws.com', 'ecr:us-east-1:aws-jenkins-build') {
                        docker.build("wipp-frontend", "--build-arg SOURCE_FOLDER=. --no-cache ./")
			docker.image("wipp-frontend").push("${BUILD_ID}")
                    }
		}
	}
}
        
   }
    post {
        always {
            slackSend channel:'#build-notifications',
            color: 'good',
            message: "${env.BUILD_URL} has result ${currentBuild.result}"
        }
    }
}
