@REM Maven Wrapper - Windows
@REM Downloads Maven wrapper JAR if not present

@IF EXIST "%~dp0.mvn\wrapper\maven-wrapper.jar" GOTO runWrapper

echo Downloading Maven Wrapper JAR...
curl -o "%~dp0.mvn\wrapper\maven-wrapper.jar" "https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar" -s

:runWrapper
set "MAVEN_PROJECTBASEDIR=%~dp0"
@java "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" -cp "%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*
