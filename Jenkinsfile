pipeline {

    agent {
        node { label 'aws && build && linux && ubuntu'}
    }

    stages {
        
        stage('Build App') {
            steps {
                
		        //sh 'ng build'
              sh 'echo "build stage"'
            }
        }
        stage('Docker build') {
            steps {
                script {
                  
                        docker.build("wipp_frontend", "--build-arg SOURCE_FOLDER=. --no-cache ./")
                    
		   }
	 }
}
        
   }
}
