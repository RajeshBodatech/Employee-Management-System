FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/ems-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 10000
ENTRYPOINT ["sh", "-c", "exec java -Dserver.port=${PORT:-10000} -Dspring.datasource.url=${SPRING_DATASOURCE_URL:-${DB_URL:-jdbc:mysql://localhost:3306/employee}} -Dspring.datasource.username=${SPRING_DATASOURCE_USERNAME:-${DB_USERNAME:-root}} -Dspring.datasource.password=${SPRING_DATASOURCE_PASSWORD:-${DB_PASSWORD:-}} -jar app.jar"]
