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
		    sh 'sudo apt-get install nodejs npm -y'
              //sh 'npm install -g @angular/cli'
		
            }
        }
        stage('Build App') {
            steps {
                
		        //sh 'ng build'
              sh 'echo "build stage"'
            }
        }
        stage('Docker build') {
            steps {
                script {
                  docker.withRegistry("${ECRADDRESS}", 'ecr:us-east-1:aws-jenkins-build') {
                        docker.build("wipp_frontend", "--build-arg SOURCE_FOLDER=. --no-cache ./")
			      docker.image("wipp_frontend").push("${BUILD_ID}")
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
